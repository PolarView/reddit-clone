import React from "react";
import { Flex } from "@chakra-ui/react";
import { CImage } from "@/chakra/factory";
import SearchInput from "./SearchInput";
import RightContent from "./rightContent/RightContent";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/clientApp";
import Directory from "./directory/Directory";
const Navbar: React.FC = () => {
  const [user] = useAuthState(auth);

  return (
    <Flex bg="white" height="44px" padding="6px 12px" justifyContent={{ md: "space-between" }}>
      <Flex
        align="center"
        width={{ base: "40px", md: "auto" }}
        mr={{ base: 0, md: 2 }}
        cursor="pointer">
        <CImage src="/images/redditFace.svg" height={9} width={9} alt="reddit Logo"></CImage>

        <CImage
          src="/images/redditText.svg"
          height="50"
          width="100"
          alt="reddit Logo"
          display={{ base: "none", md: "unset" }}></CImage>
      </Flex>
      <Directory user={user} />
      <SearchInput />
      <RightContent user={user} />
    </Flex>
  );
};

export default Navbar;
