import { CommunitySnippets } from "./../atoms/communitiesAtom";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState } from "recoil";
import { communityState } from "../atoms/communitiesAtom";
import { auth, firestore } from "../firebase/clientApp";

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
      setCommunityStateValue({
        mySnippets: snippets as CommunitySnippets[]
      });
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      console.log(error);
    }
    setLoading(false);
  };

  const onJoinLeaveCommunity = (communityId: string, isJoined: boolean) => {
    console.log(communityId, isJoined);
  };

  return {
    communityStateValue,
    onJoinLeaveCommunity,
    loading
  };
};
