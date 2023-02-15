import React from "react";
import { Flex } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import { authModalState } from "@/atoms/AuthModalAtom";
import Login from "./Login";
import Signup from "./Signup";

const AuthInputs: React.FC = () => {
  const modalState = useRecoilValue(authModalState);

  return (
    <Flex direction="column" justify="center" align="center" width="100%">
      {modalState.view === "login" && <Login />}
      {modalState.view === "signup" && <Signup />}
    </Flex>
  );
};

export default AuthInputs;
