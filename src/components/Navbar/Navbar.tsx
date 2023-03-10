import React from "react";
import { Flex } from "@chakra-ui/react";
import { CImage } from "@/chakra/factory";
import SearchInput from "./SearchInput";
import RightContent from "./rightContent/RightContent";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/clientApp";
import Directory from "./directory/Directory";
import Link from "next/link";
const Navbar: React.FC = () => {
  const [user] = useAuthState(auth);

  return (
    <Flex
      minW="450px"
      bg="white"
      height="44px"
      padding="6px 12px"
      justifyContent={{ md: "space-between" }}>
      <Link href="/">
        <Flex
          align="center"
          width={{ base: "40px", md: "auto" }}
          mr={{ base: 0, md: 2 }}
          cursor="pointer">
          <CImage src="/images/redditFace.svg" height={9} width={9} alt="reddit Logo"></CImage>

          <CImage
            src="/images/redditText.svg"
            height={9}
            width="100"
            alt="reddit Logo"
            display={{ base: "none", md: "unset" }}></CImage>
        </Flex>
      </Link>

      <Directory user={user} />
      <SearchInput />
      <RightContent user={user} />
    </Flex>
  );
};

export default Navbar;
