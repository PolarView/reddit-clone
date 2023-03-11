import React, { useEffect } from "react";
import { Flex, Button, Text } from "@chakra-ui/react";
import { CImage } from "@/chakra/factory";
import { auth, firestore } from "@/firebase/clientApp";
import { useSignInWithGoogle, useSignInWithApple } from "react-firebase-hooks/auth";
import { User } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
const AuthButtons: React.FC = () => {
  const [signInWithGoogle, userCred, googleLoading, googleError] = useSignInWithGoogle(auth);

  // const [signInWithApple, appleUser, appleLoading, AppleError] = useSignInWithApple(auth);
  const createUserDocumnet = async (user: User) => {
    const userDocRef = doc(firestore, "users", user.uid);
    await setDoc(userDocRef, JSON.parse(JSON.stringify(user)));
  };

  useEffect(() => {
    if (userCred) {
      createUserDocumnet(userCred.user);
    }
  });

  return (
    <Flex flexDirection="column" mt={2} gap={2} width="100%" align="center" justify="center">
      <Button
        variant="oauth"
        padding="7px 10px"
        isLoading={googleLoading}
        onClick={() => signInWithGoogle()}>
        <CImage width="6" height="6" alt="google icon" src="/images/googlelogo.png" mr={4}></CImage>
        <Text fontSize="18px" textAlign="center">
          Countinue with Google
        </Text>
      </Button>
      {googleError && (
        <Text width="100%" color="red.400" textAlign="center">
          {googleError.message}
        </Text>
      )}
      {/* <Button
        variant="oauth"
        padding="7px 10px"
        isLoading={appleLoading}
        onClick={() => signInWithApple()}>
        <Text>Countinue with Apple</Text>
      </Button>
      {AppleError && (
        <Text color="red.400" width="100%" textAlign="center">
          {AppleError.message}
        </Text>
      )} */}
    </Flex>
  );
};

export default AuthButtons;
