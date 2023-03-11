import React from "react";
import { Flex, Icon, MenuItem, Image } from "@chakra-ui/react";
import { IconType } from "react-icons";
import { useDirectory } from "@/hooks/useDirectory";
// import useDirectory from "../../../hooks/useDirectory";

type DirectoryItemProps = {
  displayText: string;
  link: string;
  icon: IconType;
  iconColor: string;
  imageUrl?: string;
};

const MenuListItem: React.FC<DirectoryItemProps> = ({
  displayText,
  link,
  icon,
  iconColor,
  imageUrl
}) => {
  const { selectMenuItem } = useDirectory();
  return (
    <MenuItem
      width="100%"
      fontSize="10pt"
      _hover={{ bg: "gray.100" }}
      onClick={() => selectMenuItem({ displayText, link, icon, iconColor, imageUrl })}>
      <Flex alignItems="center">
        {imageUrl ? (
          <Image borderRadius="full" boxSize="18px" src={imageUrl} mr={2} />
        ) : (
          <Icon fontSize={20} mr={2} as={icon} color={iconColor} />
        )}
        {displayText}
      </Flex>
    </MenuItem>
  );
};
export default MenuListItem;
