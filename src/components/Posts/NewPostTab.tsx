import React from "react";
import { Flex, Icon, Text, Box } from "@chakra-ui/react";
import { TabItem } from "../Posts/NewPostForm";

type NewPostTabProps = {
  tabInfo: TabItem;
  isSelectedTab: boolean;
  setSelectedTab: (tab: string) => void;
};

const NewPostTab: React.FC<NewPostTabProps> = ({ tabInfo, isSelectedTab, setSelectedTab }) => {
  return (
    <Flex
      justify="center"
      align="center"
      flexGrow={1}
      p="14px 0px"
      cursor="pointer"
      fontWeight={700}
      color={isSelectedTab ? "blue.500" : "gray.500"}
      borderWidth={isSelectedTab ? "0px 1px 2px 0px" : "0px 1px 1px 0px"}
      borderBottomColor={isSelectedTab ? "blue.500" : "gray.200"}
      borderRightColor="gray.300"
      _hover={{ bg: "gray.50" }}
      onClick={() => setSelectedTab(tabInfo.title)}>
      <Flex align="center" height="20px" mr={2}>
        <Icon height="100%" as={tabInfo.icon} fontSize={18} />
      </Flex>
      <Text fontSize="10pt">{tabInfo.title}</Text>
    </Flex>
  );
};

export default NewPostTab;
