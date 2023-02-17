import { authModalState } from "@/atoms/authModalAtom";
import { Button, Input, Flex, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth, firestore } from "../../../firebase/clientApp";
import { signUpValidation } from "@/utils/signupValidation";
import { userSignupForm } from "@/types";
import { FIREBASE_ERRORS } from "../../../firebase/errors";
import { addDoc, collection } from "firebase/firestore";
import { json } from "stream/consumers";
import { User } from "firebase/auth";

type ErrorStatus =
  | ""
  | "Min 6 chars in pass"
  | "Password should contain at least one number and one special character"
  | "Passes doesnt match";

const Signup: React.FC = () => {
  const [userSignupForm, setUserSignupForm] = useState<userSignupForm>({
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [errorStatus, setErrorStatus] = useState<ErrorStatus>("");

  const [createUserWithEmailAndPassword, userCred, loading, error] =
    useCreateUserWithEmailAndPassword(auth);

  const setAuthModalState = useSetRecoilState(authModalState);

  const onInputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserSignupForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const openLoginAuthModal = () => {
    setAuthModalState({ view: "login", open: true });
  };

  const openResetPasswordModal = () => {
    setAuthModalState({ view: "resetPassword", open: true });
  };

  const onSumbmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorStatus(signUpValidation(userSignupForm));
    if (errorStatus === "") return;

    createUserWithEmailAndPassword(userSignupForm.email, userSignupForm.password);
  };

  const createUserDocumnet = async (user: User) => {
    await addDoc(collection(firestore, "users"), JSON.parse(JSON.stringify(user)));
  };

  useEffect(() => {
    if (userCred) {
      createUserDocumnet(userCred.user);
    }
  }, [userCred]);

  return (
    <form
      onSubmit={(e) => {
        onSumbmitHandler(e);
      }}>
      <Input
        required
        name="email"
        value={userSignupForm.email}
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
        value={userSignupForm.password}
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

      <Input
        required
        name="confirmPassword"
        value={userSignupForm.confirmPassword}
        onChange={(e) => {
          onInputChangeHandler(e);
        }}
        placeholder="confirm password"
        type="password"
        mb={3}
        bg="gray.50"
        _placeholder={{ color: "gray.500" }}
        _hover={{ bg: "white", border: "1px solid", borderColor: "blue.500" }}
        _focus={{ ouline: "none", bg: "white", border: "1px solid", borderColor: "blue.500" }}
      />

      <Text textAlign="center" color="red.400" fontSize="sm">
        {errorStatus || FIREBASE_ERRORS[error?.message as keyof typeof FIREBASE_ERRORS]}
      </Text>

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
        <Text mr="6px">Already a redditor? </Text>
        <Text color="blue.500" cursor="pointer" fontWeight="700" onClick={openLoginAuthModal}>
          Login!
        </Text>
      </Flex>
    </form>
  );
};

export default Signup;
