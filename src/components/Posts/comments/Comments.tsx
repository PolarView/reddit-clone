import { Post } from "@/atoms/postsAtom";
import { User } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { Box, Flex, Text, Stack, SkeletonCircle, SkeletonText } from "@chakra-ui/react";
import CommentInput from "./CommentInput";
import {
  collection,
  doc,
  getDocs,
  increment,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  where,
  writeBatch
} from "firebase/firestore";
import CommentItem from "./CommentItem";
import { firestore } from "@/firebase/clientApp";
import { usePosts } from "@/hooks/usePosts";
import { Comment } from "./CommentItem";

type CommentsProps = {
  user?: User | null;
  selectedPost: Post | null;
  communityId?: string;
};

const Comments: React.FC<CommentsProps> = ({ user, selectedPost, communityId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [comment, setComment] = useState<string>("");
  const [commentFetchLoading, setCommentFetchLoading] = useState<boolean>(true);
  const [commentCreateLoading, setCommentCreateLoading] = useState<boolean>(false);
  const [deleteLoadingCommentId, setLoadingDeletingCommentId] = useState<string>("");
  const [isValidComment, setIsValidComment] = useState<boolean>(true);
  const { setPostStateValue } = usePosts();

  useEffect(() => {
    if (!selectedPost) return;
    getPostComments();
  }, [selectedPost]);

  const onCreateComment = async (commentText: string) => {
    if (commentText.length < 1) {
      setIsValidComment(false);
      return;
    } else {
      setIsValidComment(true);
    }
    setCommentCreateLoading(true);
    try {
      const batch = writeBatch(firestore);
      //create doc ref
      const commentDocRef = doc(collection(firestore, "comments"));

      // create comment
      const newComment: Comment = {
        id: commentDocRef.id,
        postId: selectedPost?.id!,
        communityId: communityId!,
        creatorId: user?.uid!,
        creatorName: user?.email!.split("@")[0]!,
        postTitle: selectedPost?.title!,
        createdAt: {
          seconds: Date.now() / 1000
        } as Timestamp,
        text: comment,
        creatorPhotoURL: user?.photoURL!
      };

      batch.set(commentDocRef, newComment);

      // update numofcomm in post
      const postDocRef = doc(firestore, "posts", selectedPost?.id!);
      batch.update(postDocRef, { numberOfComments: increment(1) });

      batch.commit();

      // update comments state
      setComments((prev) => [...prev, newComment]);
      setComment("");
      setPostStateValue((prev) => ({
        ...prev,
        selectedPost: {
          ...prev.selectedPost,
          numberOfComments: prev.selectedPost?.numberOfComments! + 1
        } as Post
      }));
      setCommentCreateLoading(false);
    } catch (err: any) {
      console.log(`err while creating comment ${err.message}`);
      setCommentCreateLoading(false);
    }
  };

  const onDeleteComment = async (comment: Comment) => {
    setLoadingDeletingCommentId(comment.id);
    try {
      const batch = writeBatch(firestore);
      //delet doc
      const commentDocRef = doc(firestore, "comments", comment.id);
      batch.delete(commentDocRef);

      // update numofcomm in post
      const postDocRef = doc(firestore, "posts", selectedPost?.id!);
      batch.update(postDocRef, { numberOfComments: increment(-1) });

      // update comments and post state
      setComments((prev) => prev.filter((item) => item.id !== comment.id));
      setPostStateValue((prev) => ({
        ...prev,
        selectedPost: {
          ...prev.selectedPost,
          numberOfComments: prev.selectedPost?.numberOfComments! - 1
        } as Post
      }));

      await batch.commit();
      setLoadingDeletingCommentId("");
    } catch (err: any) {
      console.log(`err while deleting a comment ${err.meassage}`);
      setLoadingDeletingCommentId("");
    }
  };
  const getPostComments = async () => {
    try {
      setCommentFetchLoading(true);
      //create query and fetch
      const commentsQuery = query(
        collection(firestore, "comments"),
        where("postId", "==", selectedPost?.id),
        orderBy("createdAt", "desc")
      );
      const commentsDocs = await getDocs(commentsQuery);

      //change comments state
      const comments = commentsDocs.docs.map((comment) => ({
        id: comment.id,
        ...comment.data()
      }));
      setComments(comments as Comment[]);
      setCommentFetchLoading(false);
    } catch (err: any) {
      console.log(`err occured while fetching post comments ${err.meassage}`);
      setCommentFetchLoading(false);
    }
  };

  return (
    <Box minW="450px" bg="white" p={2} borderRadius="0px 0px 4px 4px">
      <Flex direction="column" pl={10} pr={4} mb={6} fontSize="10pt" width="100%">
        <CommentInput
          comment={comment}
          setComment={setComment}
          loading={commentCreateLoading}
          user={user}
          onCreateComment={onCreateComment}
          isValidComment={isValidComment}
        />
      </Flex>
      <Stack spacing={6} p={2}>
        {commentFetchLoading ? (
          <>
            {[...Array(5)].map((_: any, index: number) => (
              <Box key={index} padding="6" bg="white">
                <SkeletonCircle size="10" />
                <SkeletonText mt="4" noOfLines={2} spacing="4" />
              </Box>
            ))}
          </>
        ) : (
          <>
            {!!comments.length ? (
              <>
                {comments.map((item: Comment) => (
                  <CommentItem
                    key={item.id}
                    comment={item}
                    onDeleteComment={onDeleteComment}
                    userId={user?.uid}
                    isLoading={deleteLoadingCommentId === item.id}
                  />
                ))}
              </>
            ) : (
              <Flex
                direction="column"
                justify="center"
                align="center"
                borderTop="1px solid"
                borderColor="gray.100"
                p={20}>
                <Text fontWeight={700} opacity={0.3}>
                  No Comments Yet
                </Text>
              </Flex>
            )}
          </>
        )}
      </Stack>
    </Box>
  );
};

export default Comments;
