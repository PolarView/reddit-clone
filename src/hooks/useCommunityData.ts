import { CommunitySnippets } from "./../atoms/communitiesAtom";
import { useEffect, useState } from "react";
import { collection, doc, getDocs, increment, writeBatch } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState } from "recoil";
import { communityState } from "../atoms/communitiesAtom";
import { auth, firestore } from "../firebase/clientApp";
import { Community } from "@/types";

export const useCommunityData = () => {
  const [user] = useAuthState(auth);
  const [communityStateValue, setCommunityStateValue] = useRecoilState(communityState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || !!communityStateValue.mySnippets.length) return;

    getSnippets();
  }, [user]);

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
