import React, { useState } from "react";
import { Box, Flex, Icon, MenuItem, Text } from "@chakra-ui/react";
import { useAuthState } from "react-firebase-hooks/auth";
import { FaReddit } from "react-icons/fa";
import { GrAdd } from "react-icons/gr";
import { useRecoilValue } from "recoil";
import { communityState } from "../../../atoms/communitiesAtom";
import { auth } from "../../../firebase/clientApp";
import CreateComunityModal from "@/components/modal/createCommunity/CreateComunityModal";
import MenuListItem from "./MenuListItem";
import { useCommunityData } from "@/hooks/useCommunityData";

const Communities: React.FC = () => {
  const [user] = useAuthState(auth);
  const [open, setOpen] = useState(false);
  const {
    communityStateValue: { mySnippets }
  } = useCommunityData();
  console.log(mySnippets);
  const handleCloseModal = () => {
    setOpen(false);
  };

  return (
    <>
      {mySnippets.find((item) => item.isModerator) && (
        <Box mt={3} mb={4}>
          <Text pl={3} mb={1} fontSize="7pt" fontWeight={500} color="gray.500">
            MODERATING
          </Text>
          {mySnippets
            .filter((item) => item.isModerator)
            .map((snippet) => (
              <MenuListItem
                key={snippet.communityId}
                displayText={`r/${snippet.communityId}`}
                link={`/r/${snippet.communityId}`}
                icon={FaReddit}
                iconColor="blue.500"
                imageUrl={snippet.imageUrl}
              />
            ))}
        </Box>
      )}
      <Box mt={3} mb={4}>
        <Text pl={3} mb={1} fontSize="7pt" fontWeight={500} color="gray.500">
          MY COMMUNITIES
        </Text>
        <MenuItem
          width="100%"
          fontSize="10pt"
          _hover={{ bg: "gray.100" }}
          onClick={() => setOpen(true)}>
          <Flex alignItems="center">
            <Icon fontSize={20} mr={2} as={GrAdd} />
            Create Community
          </Flex>
        </MenuItem>
        <CreateComunityModal isOpen={open} handleCloseModal={handleCloseModal} />
        {mySnippets.map((snippet) => (
          <MenuListItem
            key={snippet.communityId}
            icon={FaReddit}
            displayText={`r/${snippet.communityId}`}
            link={`/r/${snippet.communityId}`}
            iconColor="blue.500"
            imageUrl={snippet.imageUrl}
          />
        ))}
      </Box>
    </>
  );
};

export default Communities;
