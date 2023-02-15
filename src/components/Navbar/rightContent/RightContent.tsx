import React, { useEffect } from "react";
import { Button, Flex, Text } from "@chakra-ui/react";
import AuthButtons from "./AuthButtons";
import AuthModal from "../../modal/auth/AuthModal";
import { useSignOut } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/clientApp";
import { CiLogout } from "react-icons/ci";
import { User } from "firebase/auth";
import Icons from "./ActionIcons";
import UserMenu from "./UserMenu";

type RightContentProps = {
  user?: User | null;
};

const RightContent: React.FC<RightContentProps> = ({ user }) => {
  // const [signOut] = useSignOut(auth);

  return (
    <>
      <AuthModal />
      <Flex align="center" justify="center">
        {user ? <Icons /> : <AuthButtons />}
        <UserMenu user={user} />
      </Flex>
    </>
  );
};

export default RightContent;

{
  /* <Button
            px={5}
            onClick={() => {
              signOut();
            }}>
            <Flex align="center" justify="center" gap="4px">
              <Text fontWeight="semibold">Log Out</Text>
              <CiLogout color="white" fontSize={21} />
            </Flex>
          </Button> */
}
