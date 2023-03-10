import { Button } from "@chakra-ui/react";
import React from "react";
import { useSetRecoilState } from "recoil";
import authModalState from "@/atoms/authModalAtom";

type AuthBtnsProps = {
  commentsPage?: boolean;
};

const AuthButtons: React.FC<AuthBtnsProps> = ({ commentsPage }) => {
  const setAuthModalState = useSetRecoilState(authModalState);

  const openLoginAuthModal = () => {
    setAuthModalState({ view: "login", open: true });
  };

  const openSignupAuthModal = () => {
    setAuthModalState({ view: "signup", open: true });
  };

  return (
    <>
      <Button
        variant="outline"
        height="28px"
        display={commentsPage ? { md: "block" } : { base: "none", sm: "flex" }}
        width={{ base: "70px", md: "110px" }}
        mr={2}
        onClick={openLoginAuthModal}>
        Log In
      </Button>
      <Button
        variant="solid"
        height="28px"
        display={commentsPage ? { md: "flex" } : { base: "none", sm: "flex" }}
        width={{ base: "70px", md: "110px" }}
        mr={2}
        onClick={openSignupAuthModal}>
        Sign Up
      </Button>
    </>
  );
};

export default AuthButtons;
