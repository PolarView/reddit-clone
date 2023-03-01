import { useState } from "react";
import {
  Flex,
  Icon,
  Skeleton,
  Spinner,
  Stack,
  Text,
  Box,
  Image,
  Alert,
  AlertIcon,
  AlertTitle
} from "@chakra-ui/react";
import { CImage } from "@/chakra/factory";
import { NextRouter } from "next/router";
import { AiOutlineDelete } from "react-icons/ai";
import { BsChat, BsDot } from "react-icons/bs";
import { FaReddit } from "react-icons/fa";
import {
  IoArrowDownCircleOutline,
  IoArrowDownCircleSharp,
  IoArrowRedoOutline,
  IoArrowUpCircleOutline,
  IoArrowUpCircleSharp,
  IoBookmarkOutline
} from "react-icons/io5";
import { Post } from "@/atoms/postsAtom";
import moment from "moment";
type PostItemProps = {
  post: Post;
  isUserCreator: boolean;
  onVote: (post: Post, vote: number, communityId: string) => void;
  onSelectPost: () => void;
  userVoteValue?: number;
  onDeletePost: (post: Post) => Promise<boolean>;
};

const PostItem: React.FC<PostItemProps> = ({
  post,
  isUserCreator,
  onVote,
  userVoteValue,
  onDeletePost
}) => {
  const [loadingAsset, setLoadingAsset] = useState(true);
  const [error, setError] = useState(false);
  const [loadingDeleting, setLoadingDeleting] = useState(false);

  const handleDeletePost = async () => {
    try {
      setLoadingDeleting(true);
      const success = await onDeletePost(post);
      if (!success) {
        throw new Error("Failed to delete post");
      }
    } catch (err: any) {
      setLoadingDeleting(false);
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 1000);
    }
  };

  return (
    <Flex width="100%" display="column">
      <Flex width="100%">
        <Flex direction="column" align="center" p={2} width="40px" bg="gray.100">
          <Icon
            as={userVoteValue === 1 ? IoArrowUpCircleSharp : IoArrowUpCircleOutline}
            color={userVoteValue === 1 ? "brand.100" : "gray.400"}
            fontSize={22}
            cursor="pointer"
            onClick={() => {
              onVote(post, 1, post.communityId);
            }}
          />
          <Text fontSize="12pt" fontWeight={600}>
            {post.voteStatus}
          </Text>
          <Icon
            as={userVoteValue === -1 ? IoArrowDownCircleSharp : IoArrowDownCircleOutline}
            color={userVoteValue === -1 ? "#4379FF" : "gray.400"}
            fontSize={22}
            cursor="pointer"
            onClick={() => {
              onVote(post, -1, post.communityId);
            }}
          />
        </Flex>
        <Stack flexGrow={1} p={3} spacing={3} bg="white">
          <Flex align="center" gap={2} color="gray.500">
            <Text>{post.creatorDisplayName}</Text>
            <Text>{moment(new Date(post.createdAt.seconds * 1000)).fromNow()}</Text>
          </Flex>
          <Text fontSize={23} fontWeight={600}>
            {post.title}
          </Text>
          <Text fontSize={15}>{post.body}</Text>

          {post.assetUrl?.assetType === "video" && (
            <Box
              as="video"
              controls
              src={post.assetUrl.url}
              maxWidth="460px"
              maxHeight={{ sm: "600", base: "800", lg: "1000" }}
            />
          )}
          {post.assetUrl?.assetType === "image" && (
            <Image src={`${post.assetUrl.url}`} alt="post image" maxHeight="460px" />
          )}

          <Stack spacing={2} direction="row" justify="space-around">
            <Flex
              align="center"
              borderRadius={4}
              fontSize={17}
              color="gray.400"
              cursor="pointer"
              justify="center"
              gap={2}
              padding="2px 8px"
              _hover={{ bg: "gray.100", color: "black" }}>
              <Icon as={BsChat} />
              <Text>{post.numberOfComments}</Text>
            </Flex>

            <Flex
              align="center"
              borderRadius={4}
              fontSize={17}
              color="gray.400"
              cursor="pointer"
              justify="center"
              gap={2}
              padding="2px 8px"
              _hover={{ bg: "gray.100", color: "black" }}>
              <Icon as={IoArrowRedoOutline} />
              <Text>share</Text>
            </Flex>

            <Flex
              align="center"
              borderRadius={4}
              fontSize={17}
              color="gray.400"
              cursor="pointer"
              justify="center"
              gap={2}
              padding="2px 8px"
              _hover={{ bg: "gray.100", color: "black" }}>
              <Icon as={IoBookmarkOutline} />
              <Text>save</Text>
            </Flex>

            {isUserCreator && (
              <Flex
                cursor="pointer"
                align="center"
                color="gray.400"
                justify="center"
                borderRadius={4}
                fontSize={17}
                gap={2}
                padding="2px 8px"
                _hover={{ bg: "gray.100", color: "black" }}
                onClick={handleDeletePost}>
                {loadingDeleting ? (
                  <Spinner size="sm" />
                ) : (
                  <>
                    <Icon as={AiOutlineDelete} />
                    <Text>delete</Text>
                  </>
                )}
              </Flex>
            )}
          </Stack>
        </Stack>
      </Flex>
      {error && (
        <Alert status="error">
          <Flex align="center" justify="center" width="100%">
            <AlertIcon />
            <AlertTitle>Failed to delete this post!</AlertTitle>
          </Flex>
        </Alert>
      )}
    </Flex>
  );
};

export default PostItem;
