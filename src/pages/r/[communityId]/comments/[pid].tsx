import React, { useEffect } from "react";
import PageContentLayout from "@/components/Layout/PageContentLayout";
import PostItem from "@/components/Posts/PostItem";
import { usePosts } from "@/hooks/usePosts";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "@/firebase/clientApp";
import { useRouter } from "next/router";
import { doc, getDoc } from "firebase/firestore";
import { Post } from "@/atoms/postsAtom";
import About from "@/components/comunities/About";
import { useCommunityData } from "@/hooks/useCommunityData";

const SinglePostView: React.FC = () => {
  const [user] = useAuthState(auth);
  const { postStateValue, setPostStateValue, onVote, onDeletePost } = usePosts();
  const router = useRouter();
  const { communityStateValue } = useCommunityData();

  const fetchPost = async (postId: string) => {
    try {
      const postDocRef = doc(firestore, "posts", postId);
      const postDoc = await getDoc(postDocRef);
      setPostStateValue((prev) => ({
        ...prev,
        selectedPost: { id: postDoc.id, ...postDoc.data() } as Post
      }));
    } catch (err: any) {
      console.log(`fetch post err ${err.message}`);
    }
  };

  useEffect(() => {
    const { pid } = router.query;
    if (pid && !postStateValue.selectedPost) {
      fetchPost(pid as string);
    }
  }, [router.query, postStateValue.selectedPost]);

  return (
    <>
      <PageContentLayout>
        <>
          {console.log(postStateValue)}
          {postStateValue.selectedPost && (
            <PostItem
              post={postStateValue.selectedPost!}
              onDeletePost={onDeletePost}
              onVote={onVote}
              isUserCreator={user?.uid === postStateValue.selectedPost?.creatorId}
              userVoteValue={
                postStateValue.postVotes.find(
                  (item) => item.postId === postStateValue.selectedPost?.id
                )?.voteValue
              }
            />
          )}

          {/* comments */}
        </>
        {communityStateValue.currentCommunity && (
          <About communityData={communityStateValue.currentCommunity} />
        )}

        <></>
      </PageContentLayout>
    </>
  );
};

export default SinglePostView;
