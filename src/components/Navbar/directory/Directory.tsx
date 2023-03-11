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
  MenuDivider,
  Image
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { AiFillHome, AiOutlinePlus } from "react-icons/ai";
import { User } from "firebase/auth";
import { CImage } from "@/chakra/factory";
import Communities from "./Communities";
import { useDirectory } from "@/hooks/useDirectory";
import { useRouter } from "next/router";
type DirectoryProps = {
  user?: User | null;
};

const Directory: React.FC<DirectoryProps> = ({ user }) => {
  const { toggleMenuOpen, directoryState } = useDirectory();
  const { asPath } = useRouter();

  return (
    <>
      <Menu isOpen={directoryState.isOpen}>
        <MenuButton
          cursor="pointer"
          margin="0px 6px"
          padding="0px 6px"
          borderRadius="4px"
          _hover={{ outline: "1px solid", outlineColor: "gray.200" }}
          onClick={toggleMenuOpen}>
          {user && (
            <Flex align="center" justify="space-between" width="auto" gap={{ lg: "80px" }}>
              <Flex alignItems="center">
                <>
                  {asPath === "/" ? (
                    <>
                      <Icon fontSize={24} mr={{ base: 1, md: 2 }} as={AiFillHome} />
                      <Box
                        display={{ base: "none", lg: "flex" }}
                        flexDirection="column"
                        fontSize="10pt">
                        <Text fontWeight={600}>Home</Text>
                      </Box>
                    </>
                  ) : (
                    <>
                      {directoryState.selectedMenuItem.imageUrl ? (
                        <Image
                          borderRadius="full"
                          boxSize="24px"
                          src={directoryState.selectedMenuItem.imageUrl}
                          mr={2}
                          alt="current community"
                        />
                      ) : (
                        <Icon
                          fontSize={24}
                          mr={{ base: 1, md: 2 }}
                          color={directoryState.selectedMenuItem.iconColor}
                          as={directoryState.selectedMenuItem.icon}
                        />
                      )}
                      <Box
                        display={{ base: "none", lg: "flex" }}
                        flexDirection="column"
                        fontSize="10pt">
                        <Text fontWeight={600}>{directoryState.selectedMenuItem.displayText}</Text>
                      </Box>
                    </>
                  )}
                </>
              </Flex>
              <Icon as={ChevronDownIcon} color="gray.400" />
            </Flex>
          )}
        </MenuButton>
        <MenuList>
          <Communities />
        </MenuList>
      </Menu>
    </>
  );
};

export default Directory;
