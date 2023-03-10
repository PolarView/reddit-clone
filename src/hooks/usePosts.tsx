import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { postState, PostVote } from "@/atoms/postsAtom";
import { Post } from "@/atoms/postsAtom";
import { auth, firestore, storage } from "@/firebase/clientApp";
import { deleteObject, ref } from "firebase/storage";
import { collection, deleteDoc, doc, getDocs, query, where, writeBatch } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect } from "react";
import { communityState } from "@/atoms/communitiesAtom";
import authModalState from "@/atoms/authModalAtom";
import { useRouter } from "next/router";

export const usePosts = () => {
  const [postStateValue, setPostStateValue] = useRecoilState(postState);
  const { currentCommunity } = useRecoilValue(communityState);
  const setAuthModalState = useSetRecoilState(authModalState);
  const [user] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (!user || !currentCommunity?.id) return;
    getCommunityPostVotes(currentCommunity?.id);
    console.log("getComm");
  }, [user, currentCommunity?.id]);

  useEffect(() => {
    console.log(user);
    if (!user) {
      setPostStateValue((prev) => ({ ...prev, postVotes: [] }));
      console.log("!user postVal works");
    }
  }, [user]);

  const onVote = async (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    post: Post,
    vote: number,
    communityId: string
  ) => {
    event.stopPropagation();
    if (!user?.uid) {
      setAuthModalState({ open: true, view: "login" });
      return;
    }

    const { voteStatus } = post;
    // const existingVote = post.currentUserVoteStatus;
    const existingVote = postStateValue.postVotes.find((vote) => vote.postId === post.id);

    // is this an upvote or a downvote?
    // has this user voted on this post already? was it up or down?

    try {
      let voteChange = vote;
      const batch = writeBatch(firestore);

      const updatedPost = { ...post };
      const updatedPosts = [...postStateValue.posts];
      let updatedPostVotes = [...postStateValue.postVotes];

      // New vote
      if (!existingVote) {
        const postVoteRef = doc(collection(firestore, "users", `${user.uid}/postVotes`));

        const newVote: PostVote = {
          id: postVoteRef.id,
          postId: post.id!,
          communityId,
          voteValue: vote
        };

        console.log("NEW VOTE!!!", newVote);

        // APRIL 25 - DON'T THINK WE NEED THIS
        // newVote.id = postVoteRef.id;

        batch.set(postVoteRef, newVote);

        updatedPost.voteStatus = voteStatus + vote;
        updatedPostVotes = [...updatedPostVotes, newVote];
      }
      // Removing existing vote
      else {
        // Used for both possible cases of batch writes
        const postVoteRef = doc(firestore, "users", `${user.uid}/postVotes/${existingVote.id}`);

        // Removing vote
        if (existingVote.voteValue === vote) {
          voteChange *= -1;
          updatedPost.voteStatus = voteStatus - vote;
          updatedPostVotes = updatedPostVotes.filter((vote) => vote.id !== existingVote.id);
          batch.delete(postVoteRef);
        }
        // Changing vote
        else {
          voteChange = 2 * vote;
          updatedPost.voteStatus = voteStatus + 2 * vote;
          const voteIdx = postStateValue.postVotes.findIndex((vote) => vote.id === existingVote.id);
          // console.log("HERE IS VOTE INDEX", voteIdx);

          // Vote was found - findIndex returns -1 if not found
          if (voteIdx !== -1) {
            updatedPostVotes[voteIdx] = {
              ...existingVote,
              voteValue: vote
            };
          }
          batch.update(postVoteRef, {
            voteValue: vote
          });
        }
      }

      let updatedState = { ...postStateValue, postVotes: updatedPostVotes };

      const postIdx = postStateValue.posts.findIndex((item) => item.id === post.id);

      updatedPosts[postIdx!] = updatedPost;
      updatedState = {
        ...updatedState,
        posts: updatedPosts
      };
      // }

      /**
       * Optimistically update the UI
       * Used for single page view [pid]
       * since we don't have real-time listener there
       */
      if (updatedState.selectedPost) {
        updatedState = {
          ...updatedState,
          selectedPost: updatedPost
        };
      }

      // Optimistically update the UI
      setPostStateValue(updatedState);

      // Update database
      const postRef = doc(firestore, "posts", post.id!);
      batch.update(postRef, { voteStatus: voteStatus + voteChange });
      await batch.commit();
    } catch (error) {
      console.log("onVote error", error);
    }
  };

  const onSelectPost = (post: Post) => {
    setPostStateValue((prev) => {
      const { communityId } = router.query;

      if (communityId) {
        // case when we click on postItem from /r/communityId/
        router.push(`/r/${communityId}/comments/${post.id}`);
        return { ...prev, selectedPost: post };
      } else {
        // case when we click on postItem from home page and dont have a communityId in url
        const { communityId } = post;
        router.push(`/r/${communityId}/comments/${post.id}`);
        return { ...prev, selectedPost: post };
      }
    });
  };

  const onDeletePost = async (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    post: Post
  ): Promise<boolean> => {
    event.stopPropagation();
    try {
      // check if post has an asset
      if (post.assetUrl) {
        const assetRef = ref(storage, `posts/${post.id}/${post.assetUrl.assetType}`);
        await deleteObject(assetRef);
      }

      // delete post from db
      const postDocRef = doc(firestore, "posts", post.id!);
      await deleteDoc(postDocRef);

      // update state to rerender the DOM
      setPostStateValue((prev) => ({
        ...prev,
        posts: prev.posts.filter((item) => item.id !== post.id)
      }));

      return true;
    } catch (err: any) {
      console.log(err.message);
      return false;
    }
  };

  const getCommunityPostVotes = async (communityId: string) => {
    const postVotesQuery = query(
      collection(firestore, `users/${user?.uid}/postVotes`),
      where("communityId", "==", communityId)
    );
    const postVoteDocs = await getDocs(postVotesQuery);
    const postVotes = postVoteDocs.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
    setPostStateValue((prev) => ({
      ...prev,
      postVotes: postVotes as PostVote[]
    }));
    console.log("func");
  };

  return {
    onVote,
    onSelectPost,
    onDeletePost,
    postStateValue,
    setPostStateValue
  };
};
