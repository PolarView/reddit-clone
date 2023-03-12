import PageContentLayout from "@/components/Layout/PageContentLayout";
import { auth, firestore } from "@/firebase/clientApp";
import { useAuthState } from "react-firebase-hooks/auth";
import { usePosts } from "@/hooks/usePosts";
import { useEffect, useState } from "react";
import {
  collection,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  where
} from "firebase/firestore";
import { Post, PostVote } from "@/atoms/postsAtom";
import { Spinner, Stack } from "@chakra-ui/react";
import PostItem from "@/components/Posts/PostItem";
import { useCommunityData } from "@/hooks/useCommunityData";
import CreatePostLink from "@/components/comunities/CreatePostLink";

export default function Home() {
  const [user, loadingUser] = useAuthState(auth);
  const { onVote, onSelectPost, onDeletePost, postStateValue, setPostStateValue } = usePosts();
  const [homeFeedLoading, setHomeFeedLoading] = useState<boolean>(true);
  const { communityStateValue } = useCommunityData();
  const buildNoUserHomeFeed = async () => {
    try {
      //querying top 10 posts by vote field
      const feedQuery = query(
        collection(firestore, "posts"),
        orderBy("voteStatus", "desc"),
        limit(10)
      );

      const postDocs = await getDocs(feedQuery);
      const postFeed = postDocs.docs.map((post) => ({ id: post.id, ...post.data() }));
      setPostStateValue((prev) => ({
        ...prev,
        posts: postFeed as Post[]
      }));
      setHomeFeedLoading(false);
      console.log("no user home feed");
    } catch (err: any) {
      console.log(`err while fetching no user home feed ${err.message}`);
      setHomeFeedLoading(false);
    }
  };

  const buildRedditorHomeFeed = async () => {
    setHomeFeedLoading(true);
    try {
      if (communityStateValue.mySnippets.length) {
        // get posts from users communitites
        const myCommuntyIds = communityStateValue.mySnippets.map((snippet) => snippet.communityId);
        const postsQuery = query(
          collection(firestore, "posts"),
          where("communityId", "in", myCommuntyIds),
          limit(10)
        );
        const postDocs = await getDocs(postsQuery);
        const userPosts = postDocs.docs.map((post) => ({ id: post.id, ...post.data() }));
        // change post state
        setPostStateValue((prev) => ({
          ...prev,
          posts: userPosts as Post[]
        }));
        setHomeFeedLoading(false);
        console.log("fetched user posts");
      } else {
        buildNoUserHomeFeed();
      }
    } catch (err: any) {
      console.log(`err occured while fetching user posts on home page ${err.messaage}`);
      setHomeFeedLoading(false);
    }
  };

  const getUsersPostVotes = async () => {
    try {
      const postIds = postStateValue.posts.map((post) => post.id);
      const postVotesQuery = query(
        collection(firestore, `users/${user?.uid}/postVotes`),
        where("postId", "in", postIds)
      );
      const unsubscribe = onSnapshot(postVotesQuery, (querySnapshot) => {
        const postVotes = querySnapshot.docs.map((postVote) => ({
          id: postVote.id,
          ...postVote.data()
        }));

        setPostStateValue((prev) => ({
          ...prev,
          postVotes: postVotes as PostVote[]
        }));
      });
      console.log("post votes fetched from home");
      return () => unsubscribe();
    } catch (err: any) {
      console.log(`err occured in getUserPostVotes func ${err.messaage}`);
    }
  };

  useEffect(() => {
    if (!user && !loadingUser) {
      buildNoUserHomeFeed();
    }
  }, [user, loadingUser]);

  useEffect(() => {
    if (communityStateValue.snippetsFetched) buildRedditorHomeFeed();
  }, [communityStateValue.snippetsFetched]);

  useEffect(() => {
    if (user?.uid && postStateValue.posts) getUsersPostVotes();

    return () => {
      setPostStateValue((prev) => ({
        ...prev,
        postVotes: []
      }));
    };
  }, [user?.uid, postStateValue.posts]);

  return (
    <>
      <PageContentLayout>
        <>
          {homeFeedLoading ? (
            <Spinner />
          ) : (
            <Stack width="100%">
              {postStateValue.posts.map((post) => (
                <PostItem
                  key={post.id}
                  post={post}
                  onVote={onVote}
                  onSelectPost={onSelectPost}
                  isUserCreator={user?.uid === post.creatorId}
                  userVoteValue={
                    postStateValue.postVotes.find((item) => item.postId === post.id)?.voteValue
                  }
                  onDeletePost={onDeletePost}
                  homePage
                />
              ))}
            </Stack>
          )}
        </>

        <>{/* recs */}</>
      </PageContentLayout>
    </>
  );
}
