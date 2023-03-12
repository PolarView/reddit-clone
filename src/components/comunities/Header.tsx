import React from "react";
import { Flex, Box, Text, Button } from "@chakra-ui/react";
import { CImage } from "@/chakra/factory";
import { Community } from "@/types";
import { useCommunityData } from "@/hooks/useCommunityData";

type HeaderProps = {
  communityData: Community;
};

const Header: React.FC<HeaderProps> = ({ communityData }) => {
  const { communityStateValue, loading, onJoinLeaveCommunity } = useCommunityData();

  const isJoined = !!communityStateValue.mySnippets.find(
    (item) => item.communityId === communityData.id
  );

  return (
    <Flex minW="450px" width="100%" height="146px" direction="column">
      <Box bg="blue.500" height="50%"></Box>
      <Flex bg="white" justify="center" flexGrow={1}>
        <Flex maxWidth="850px" width="95%">
          {communityStateValue.currentCommunity?.imageUrl ? (
            <CImage
              position="relative"
              top={-3}
              borderRadius="full"
              border="4px solid white"
              borderColor="white"
              width={14}
              height={14}
              src={communityStateValue.currentCommunity.imageUrl}
              alt="community icon"
            />
          ) : (
            <CImage
              position="relative"
              top={-3}
              border="4px solid"
              borderColor="white"
              borderRadius="full"
              src="/images/redditFace.svg"
              height={14}
              width={14}
              alt="reddit Logo"></CImage>
          )}
          <Flex padding="10px 16px">
            <Flex direction="column" gap={1} mr={5}>
              <Text fontWeight={800} fontSize="18px">
                {communityData.id}
              </Text>
              <Text color="gray.500" fontSize="16px">
                r/{communityData.id}
              </Text>
            </Flex>
            <Button
              isLoading={loading}
              px={5}
              height="30px"
              variant={isJoined ? "outline" : "solid"}
              onClick={() => {
                onJoinLeaveCommunity(communityData, isJoined);
              }}>
              {isJoined ? "Leave" : "Join"}
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Header;
