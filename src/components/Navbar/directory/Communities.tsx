import React, { useState } from "react";
import CreateComunityModal from "@/components/modal/createCommunity/CreateComunityModal";
import { MenuGroup, MenuItem, Flex, Text, Icon } from "@chakra-ui/react";
import { CImage } from "@/chakra/factory";
import { AiOutlinePlus } from "react-icons/ai";
const Communities: React.FC = () => {
  const [isCreateCommunityModalOpen, setIsCreateCommunityModalOpen] = useState(false);

  return (
    <>
      <CreateComunityModal
        isOpen={isCreateCommunityModalOpen}
        handleCloseModal={() => setIsCreateCommunityModalOpen(false)}
      />

      <MenuItem>
        <Flex align="center" gap={2} onClick={() => setIsCreateCommunityModalOpen(true)}>
          <Icon as={AiOutlinePlus} fontSize={22} />
          <Text>Create Community</Text>
        </Flex>
      </MenuItem>
      <MenuItem>
        <Flex align="center" gap={2}>
          <CImage src="/images/redditlogo.png" width={8} height={8} rounded="50%" alt="groupIcon" />
          <Text>my/best-ideot-club-group</Text>
        </Flex>
      </MenuItem>
      <MenuItem>
        <Flex align="center" gap={2}>
          <CImage src="/images/redditlogo.png" width={8} height={8} rounded="50%" alt="groupIcon" />
          <Text>my/best-ideot-club-group</Text>
        </Flex>
      </MenuItem>
    </>
  );
};

export default Communities;
