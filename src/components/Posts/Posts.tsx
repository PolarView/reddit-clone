import { auth, firestore } from "@/firebase/clientApp";
import { usePosts } from "@/hooks/usePosts";
import { Community } from "@/types";
import { Post } from "@/atoms/postsAtom";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { Stack } from "@chakra-ui/react";
import PostItem from "./PostItem";
import { useAuthState } from "react-firebase-hooks/auth";
import PostSkeleton from "./PostSkeleton";

type PostsProps = {
  communityData: Community;
};

const Posts: React.FC<PostsProps> = ({ communityData }) => {
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const { postStateValue, setPostStateValue, onVote, onSelectPost, onDeletePost } = usePosts();

  useEffect(() => {
    getPosts();
  }, []);

  const getPosts = async () => {
    try {
      setLoading(true);
      //get posts from db
      const postsQuery = query(
        collection(firestore, "posts"),
        where("communityId", "==", communityData.id),
        orderBy("createdAt", "desc")
      );

      const postDocs = await getDocs(postsQuery);

      //save posts in state
      const posts = postDocs.docs.map((post) => ({ ...post.data(), id: post.id }));

      setPostStateValue((prev) => ({
        ...prev,
        posts: posts as Post[]
      }));

      setLoading(false);
      setError(false);
    } catch (err: any) {
      setLoading(false);
      console.log(`Error occured duaring getPosts: ${err.message}`);
      setError(true);
    }
  };

  return (
    <>
      {loading ? (
        [...Array(5)].map((_: any, index: any) => <PostSkeleton key={index} />)
      ) : (
        <Stack>
          {postStateValue.posts.map((post) => (
            <PostItem
              key={post.id}
              post={post}
              onVote={onVote}
              onSelectPost={onSelectPost}
              isUserCreator={user?.uid === post.creatorId}
              userVoteValue={undefined}
            />
          ))}
        </Stack>
      )}
    </>
  );
};

export default Posts;
