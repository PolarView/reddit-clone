import React from "react";
import { Flex } from "@chakra-ui/react";

type PageContentLayoutProps = {
  children: React.ReactNode[];
};

const PageContentLayout: React.FC<PageContentLayoutProps> = ({ children }) => {
  return (
    <Flex padding="16px 0px" justify="center">
      <Flex width="95%" maxWidth="850px" justify="center">
        <Flex width={{ base: "100%", md: "65%" }} mr={6} direction="column">
          {children[0]}
        </Flex>
        <Flex display={{ base: "none", md: "flex" }} flexGrow={1} direction="column">
          {children[1]}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default PageContentLayout;
