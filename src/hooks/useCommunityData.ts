import { CommunitySnippets } from "@/types";
import { useEffect, useState } from "react";
import { collection, doc, getDocs, increment, writeBatch } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState, useSetRecoilState } from "recoil";
import { communityState } from "../atoms/communitiesAtom";
import { auth, firestore } from "../firebase/clientApp";
import { authModalState } from "@/atoms/authModalAtom";
import { getDoc } from "firebase/firestore";

import { Community } from "@/types";
import { useRouter } from "next/router";

export const useCommunityData = () => {
  const [user] = useAuthState(auth);
  const [communityStateValue, setCommunityStateValue] = useRecoilState(communityState);
  const setAuthModalState = useSetRecoilState(authModalState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!user || !!communityStateValue.mySnippets.length) {
      setCommunityStateValue((prev) => ({ ...prev, mySnippets: [] }));
      return;
    }
    getSnippets();
  }, [user]);

  const fetchCommunity = async (communityId: string) => {
    try {
      const communityDocRef = doc(firestore, "communities", communityId as string);
      const communityDoc = await getDoc(communityDocRef);

      setCommunityStateValue((prev) => ({
        ...prev,
        currentCommunity: {
          id: communityDoc.id,
          ...communityDoc.data()
        } as Community
      }));
    } catch (error: any) {
      console.log("getCommunityData error", error.message);
    }
  };

  useEffect(() => {
    const { communityId } = router.query;
    console.log(communityId, Boolean(communityStateValue.currentCommunity));
    if (communityId) {
      fetchCommunity(communityId as string);
      console.log("fetching", communityStateValue.currentCommunity);
    }
  }, [router.query, communityStateValue.currentCommunity]);

  const getSnippets = async () => {
    setLoading(true);
    try {
      const snippetDocs = await getDocs(
        collection(firestore, `users/${user?.uid}/communitySnippets`)
      );

      const snippets = snippetDocs.docs.map((doc) => ({ ...doc.data() }));
      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: snippets as CommunitySnippets[]
      }));
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      console.log(error);
    }
    setLoading(false);
  };

  const onJoinLeaveCommunity = (communityData: Community, isJoined: boolean) => {
    if (!user) {
      setAuthModalState({ open: true, view: "login" });
      return;
    }
    if (isJoined) {
      leaveCommunity(communityData);
    } else {
      joinCommunity(communityData);
    }
  };

  const joinCommunity = async (communityData: Community) => {
    setLoading(true);
    try {
      const batch = writeBatch(firestore);

      const newSnippet = {
        communityId: communityData.id,
        imageUrl: communityData.imageUrl || ""
      };

      batch.set(
        doc(firestore, `users/${user?.uid}/communitySnippets`, communityData.id),
        newSnippet
      );

      batch.update(doc(firestore, "communities", communityData.id), {
        numberOfMembers: increment(1)
      });

      await batch.commit();

      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: [...prev.mySnippets, newSnippet]
      }));
    } catch (err: any) {
      setError(err.message);
      console.log(error);
      setLoading(false);
    }
    setLoading(false);
  };

  const leaveCommunity = async (communityData: Community) => {
    setLoading(true);
    try {
      const batch = writeBatch(firestore);

      batch.delete(doc(firestore, `users/${user?.uid}/communitySnippets`, communityData.id));

      batch.update(doc(firestore, "communities", communityData.id), {
        numberOfMembers: increment(-1)
      });

      await batch.commit();

      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: prev.mySnippets.filter((snippet) => snippet.communityId !== communityData.id)
      }));
    } catch (err: any) {
      setError(err.message);
      console.log(error);
      setLoading(false);
    }
    setLoading(false);
  };

  return {
    communityStateValue,
    onJoinLeaveCommunity,
    loading
  };
};
