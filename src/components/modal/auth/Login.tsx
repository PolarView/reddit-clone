import authModalState from "@/atoms/authModalAtom";
import { Button, Input, Flex, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { useSetRecoilState } from "recoil";
import { userLoginForm } from "@/types";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/clientApp";
import { FirebaseError } from "firebase/app";
import { FIREBASE_ERRORS } from "@/firebase/errors";
const Login: React.FC = () => {
  const [userLoginForm, setUserLoginForm] = useState<userLoginForm>({
    email: "",
    password: ""
  });

  const setAuthModalState = useSetRecoilState(authModalState);

  const [signInWithEmailAndPassword, user, loading, error] = useSignInWithEmailAndPassword(auth);

  const onInputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserLoginForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const openSignupAuthModal = () => {
    setAuthModalState({ view: "signup", open: true });
  };

  const openResetPasswordModal = () => {
    setAuthModalState({ view: "resetPassword", open: true });
  };

  const onSumbmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signInWithEmailAndPassword(userLoginForm.email, userLoginForm.password);
  };

  return (
    <form
      onSubmit={(e) => {
        onSumbmitHandler(e);
      }}>
      <Input
        required
        name="email"
        value={userLoginForm.email}
        onChange={(e) => {
          onInputChangeHandler(e);
        }}
        placeholder="email"
        type="email"
        mb={3}
        bg="gray.50"
        _placeholder={{ color: "gray.500" }}
        _hover={{ bg: "white", border: "1px solid", borderColor: "blue.500" }}
        _focus={{ ouline: "none", bg: "white", border: "1px solid", borderColor: "blue.500" }}
      />
      <Input
        required
        name="password"
        value={userLoginForm.password}
        onChange={(e) => {
          onInputChangeHandler(e);
        }}
        placeholder="password"
        type="password"
        mb={3}
        bg="gray.50"
        _placeholder={{ color: "gray.500" }}
        _hover={{ bg: "white", border: "1px solid", borderColor: "blue.500" }}
        _focus={{ ouline: "none", bg: "white", border: "1px solid", borderColor: "blue.500" }}
      />
      {error && (
        <Text textAlign="center" color="red.400">
          {FIREBASE_ERRORS[error.message as keyof typeof FIREBASE_ERRORS]}
        </Text>
      )}
      <Button
        type="submit"
        width="100%"
        height="36px"
        mt={2}
        mb={2}
        fontSize="19px"
        isLoading={loading}>
        Login
      </Button>
      <Flex align="center" justify="center" width="100%" fontSize="12px">
        <Text mr="6px">Forgot your password? </Text>
        <Text color="blue.500" cursor="pointer" fontWeight="700" onClick={openResetPasswordModal}>
          Reset password!
        </Text>
      </Flex>
      <Flex align="center" justify="center" width="100%" fontSize="12px">
        <Text mr="6px">New here? </Text>
        <Text color="blue.500" cursor="pointer" fontWeight="700" onClick={openSignupAuthModal}>
          Sign up!
        </Text>
      </Flex>
    </form>
  );
};

export default Login;
