/* eslint-disable react/no-children-prop*/
import React from "react";
import { InputGroup, InputLeftElement, Input } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { Flex } from "@chakra-ui/react";

const SearchInput: React.FC = () => {
  return (
    <Flex align="center" flexGrow="1" margin="0px 6px">
      <InputGroup>
        <InputLeftElement pointerEvents="none" children={<SearchIcon mb="1" color="gray.400" />} />
        <Input
          type="text"
          placeholder="Search Reddit"
          fontSize="10pt"
          height="34px"
          bg="gray.50"
          _placeholder={{ color: "gray.500" }}
          _hover={{ bg: "white", border: " 1px solid", borderColor: "blue.500" }}
          _focus={{ ouline: "none", border: "1px solid", borderColor: "blue.500" }}
        />
      </InputGroup>
    </Flex>
  );
};

export default SearchInput;
