/* eslint-disable react-hooks/exhaustive-deps*/

import {
  ModalContent,
  Modal,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalOverlay,
  Text
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import { authModalState } from "@/atoms/authModalAtom";
import { Flex } from "@chakra-ui/react";
import AuthInputs from "./AuthInputs";
import AuthButtons from "./AuthButtons";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../../firebase/clientApp";
import ResetPassword from "./ResetPassword";
const AuthModal: React.FC = () => {
  const [modalState, setModalState] = useRecoilState(authModalState);
  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    if (user) {
      closeModalHandler();
    }
  }, [user]);

  const closeModalHandler = () => {
    setModalState((prev) => ({
      ...prev,
      open: false
    }));
  };

  return (
    <Modal isOpen={modalState.open} onClose={closeModalHandler}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center">
          {modalState.view === "login" && "Login"}
          {modalState.view === "signup" && "Sign Up"}
          {modalState.view === "resetPassword" && "Reset Password"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody
          display="flex"
          alignItems="center"
          flexDirection="column"
          justifyContent="center"
          mt={6}>
          {modalState.view === "resetPassword" ? (
            <ResetPassword />
          ) : (
            <Flex align="center" justify="center" direction="column" width="70%">
              <AuthButtons />
              <Text color="gray.500" fontWeight="700" margin="16px 0px">
                OR
              </Text>
              <AuthInputs />
            </Flex>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AuthModal;
