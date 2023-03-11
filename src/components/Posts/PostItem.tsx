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
import Link from "next/link";
import { NextRouter, useRouter } from "next/router";
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
  onVote: (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    post: Post,
    vote: number,
    communityId: string
  ) => void;
  onSelectPost?: (post: Post) => void;
  userVoteValue?: number;
  onDeletePost: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    post: Post
  ) => Promise<boolean>;
  homePage?: boolean;
};

const PostItem: React.FC<PostItemProps> = ({
  post,
  isUserCreator,
  onVote,
  userVoteValue,
  onDeletePost,
  onSelectPost,
  homePage
}) => {
  const [loadingAsset, setLoadingAsset] = useState(true);
  const [error, setError] = useState(false);
  const [loadingDeleting, setLoadingDeleting] = useState(false);
  const [isSharedLink, setIsSharedLink] = useState<boolean>(false);
  const singlePostView = !onSelectPost;
  const router = useRouter();

  const copyToClipBoard = async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    try {
      const currentUrl = router.asPath;
      await navigator.clipboard.writeText(currentUrl);
      setIsSharedLink(true);
    } catch (err) {
      setIsSharedLink(false);
    }
  };

  const handleDeletePost = async (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    try {
      setLoadingDeleting(true);
      const success = await onDeletePost(event, post);
      if (!success) {
        throw new Error("Failed to delete post");
      }
      if (singlePostView) {
        router.push(`/r/${post.communityId}`);
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
    <Flex
      width="100%"
      cursor={singlePostView ? "unset" : "pointer"}
      display="column"
      border="1px solid"
      borderColor={singlePostView ? "white" : "gray.300"}
      borderRadius={singlePostView ? "4px 4px 0px 0px" : 4}
      onClick={() => !singlePostView && onSelectPost(post)}
      _hover={{ borderColor: singlePostView ? "none" : "gray.500" }}>
      <Flex width="100%">
        <Flex
          direction="column"
          align="center"
          p={2}
          width="40px"
          borderRadius={singlePostView ? "0" : "3px 0px 0px 3px"}
          bg={singlePostView ? "white" : "gray.100"}>
          <Icon
            as={userVoteValue === 1 ? IoArrowUpCircleSharp : IoArrowUpCircleOutline}
            color={userVoteValue === 1 ? "brand.100" : "gray.400"}
            fontSize={22}
            cursor="pointer"
            onClick={(event) => {
              onVote(event, post, 1, post.communityId);
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
            onClick={(event) => {
              onVote(event, post, -1, post.communityId);
            }}
          />
        </Flex>
        <Stack flexGrow={1} p={3} spacing={3} bg="white">
          <Flex align="center" gap={2} color="gray.500">
            {homePage && (
              <>
                {post.communityImageUrl ? (
                  <Image
                    borderRadius="full"
                    boxSize="18px"
                    src={post.communityImageUrl}
                    mr={2}
                    alt="community avatar"
                  />
                ) : (
                  <Icon as={FaReddit} fontSize={18} mr={1} color="blue.500" />
                )}
                <Link href={`r/${post.communityId}`}>
                  <Text
                    fontWeight={700}
                    _hover={{ textDecoration: "underline" }}
                    onClick={(event) => event.stopPropagation()}>{`r/${post.communityId}`}</Text>
                </Link>
                <Icon as={BsDot} color="gray.500" fontSize={8} />
              </>
            )}
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
              onClick={(e) => copyToClipBoard(e)}
              align="center"
              borderRadius={4}
              fontSize={17}
              color="gray.400"
              cursor="pointer"
              justify="center"
              gap={2}
              padding="2px 8px"
              _hover={{ bg: "gray.100", color: "black" }}>
              {isSharedLink || <Icon as={IoArrowRedoOutline} />}
              <Text>{isSharedLink ? "Copied!" : "Share"}</Text>
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
                onClick={(event) => handleDeletePost(event)}>
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
