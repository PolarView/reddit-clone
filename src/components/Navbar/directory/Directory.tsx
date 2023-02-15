import React from "react";
import {
  Flex,
  Text,
  Icon,
  Box,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { AiFillHome, AiOutlinePlus } from "react-icons/ai";
import { User } from "firebase/auth";
import { CImage } from "@/chakra/factory";
import Communities from "./Communities";

type DirectoryProps = {
  user?: User | null;
};

const Directory: React.FC<DirectoryProps> = ({ user }) => {
  return (
    <>
      <Menu>
        <MenuButton
          cursor="pointer"
          margin="0px 6px"
          padding="0px 6px"
          borderRadius="4px"
          _hover={{ outline: "1px solid", outlineColor: "gray.200" }}>
          {user && (
            <Flex align="center" justify="space-between" width="auto" gap={{ lg: "80px" }}>
              <Flex align="center">
                <Icon as={AiFillHome} fontSize={21} mr="8px" />
                <Text display={{ base: "none", lg: "block" }} fontWeight="600">
                  Home
                </Text>
              </Flex>
              <Icon as={ChevronDownIcon} color="gray.400" />
            </Flex>
          )}
        </MenuButton>
        <MenuList>
          <MenuGroup title="MODERATING" color="gray.400" fontSize="12px">
            <MenuItem>
              <Flex align="center" gap={2}>
                <CImage
                  src="/images/redditlogo.png"
                  width={8}
                  height={8}
                  rounded="50%"
                  alt="groupIcon"
                />
                <Text>my/best-ideot-club-group</Text>
              </Flex>
            </MenuItem>
          </MenuGroup>
          <MenuGroup title="MY COMMUNITES" color="gray.400" fontSize="12px">
            <Communities />
          </MenuGroup>
        </MenuList>
      </Menu>
    </>
  );
};

export default Directory;
