import React, { useState } from "react";
import {
  Input,
  Box,
  Button,
  Flex,
  Text,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Divider,
  Stack,
  Checkbox
} from "@chakra-ui/react";
import { BsFillEyeFill, BsFillPersonFill } from "react-icons/bs";
import { HiLockClosed } from "react-icons/hi";
import { GrAnalytics } from "react-icons/gr";
import { doc, getDoc, runTransaction, serverTimestamp, setDoc } from "firebase/firestore";
import { firestore } from "@/firebase/clientApp";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/clientApp";

type CreateComunityModalProps = {
  isOpen: boolean;
  handleCloseModal: () => void;
};

type CommunityType = null | "Public" | "Private" | "Restricted";

const CreateComunityModal: React.FC<CreateComunityModalProps> = ({ isOpen, handleCloseModal }) => {
  const [communityName, setCommunityName] = useState<string>("");
  const [charsRemain, setCharsRemain] = useState<number>(21);
  const [communityType, setCommunityType] = useState<CommunityType>(null);
  const [createCommunityError, setCreateCommunityError] = useState(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [user] = useAuthState(auth);

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentInputLength = e.target.value.length;
    if (currentInputLength <= 21) {
      setCommunityName(e.target.value);
      setCharsRemain(21 - e.target.value.length);
    }
  };

  const communityTypeChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommunityType(e.target.name as CommunityType);
  };

  const createCommunityHandler = async () => {
    // validation
    const minCommunityNameLength = 3;
    const format = /^[A-Za-z0-9 ]+$/;
    if (createCommunityError) setCreateCommunityError(null);
    try {
      setLoading(true);
      if (!format.test(communityName) || communityName.length < minCommunityNameLength) {
        throw new Error(
          "Your community name should be more than 3 chars and contain only letters and numbers"
        );
      }

      if (!communityType) {
        throw new Error("Please, choose community type");
      }

      await runTransaction(firestore, async (transaction) => {
        const communityDocRef = doc(firestore, "communities", communityName);
        const document = await transaction.get(communityDocRef);
        if (document.exists()) {
          throw new Error("Community with this name already exists. Try another");
        }

        transaction.set(communityDocRef, {
          creatorId: user?.uid,
          createdAt: serverTimestamp(),
          numberOfMembers: 1,
          communityType
        });

        transaction.set(doc(firestore, `users/${user!.uid}/communitySnippets`, communityName), {
          communityId: communityName,
          isModerator: true
        });
      });

      setLoading(false);
    } catch (err: any) {
      setCreateCommunityError(err.message);
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleCloseModal} size="2xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader padding={2} fontSize={19}>
          Create Community
        </ModalHeader>
        <Box pl={3} pr={3}>
          <Divider />
          <ModalCloseButton />
          <ModalBody display="flex" flexDirection="column" padding="10px 0">
            <Text fontSize={18} fontWeight={600}>
              Name
            </Text>
            <Text color="gray.500" my={4}>
              Community name including captalization cannot be changed
            </Text>
            <Text
              color="gray.500"
              fontSize={18}
              position="relative"
              top="34px"
              left="10px"
              width="20px">
              /r
            </Text>
            <Input
              position="relative"
              value={communityName}
              size="md"
              fontSize={18}
              pl="24px"
              onChange={(e) => {
                inputChangeHandler(e);
              }}
            />
            <Text ml={2} fontWeight={600} mt={2} color={charsRemain === 0 ? "red.400" : "gray.700"}>
              {charsRemain} characters remaining
            </Text>
            {createCommunityError && (
              <Box
                textAlign="center"
                margin={3}
                border="2px solid"
                padding={2}
                fontWeight={600}
                bg="red.300"
                borderColor="red.800"
                borderRadius="10px">
                {createCommunityError}
              </Box>
            )}

            <Box marginY={5}>
              <Text mb={4} fontSize={18} fontWeight={600}>
                Community Type
              </Text>
              <Stack spacing={4}>
                <Checkbox
                  name="Public"
                  onChange={(e) => communityTypeChangeHandler(e)}
                  isChecked={communityType === "Public" ? true : false}>
                  <Flex align="center" gap={2}>
                    <Icon fontWeight={700} as={BsFillPersonFill} />
                    <Text fontSize={17} fontWeight={700}>
                      Public
                    </Text>
                    <Text color="gray.500">Anyone can view, update and comment posts </Text>
                  </Flex>
                </Checkbox>
                <Checkbox
                  name="Restricted"
                  onChange={(e) => communityTypeChangeHandler(e)}
                  isChecked={communityType === "Restricted" ? true : false}>
                  <Flex align="center" gap={2}>
                    <Icon fontWeight={700} as={BsFillEyeFill} />
                    <Text fontSize={17} fontWeight={700}>
                      Restricted
                    </Text>
                    <Text color="gray.500">
                      Anyone can view, but update and comment only by your permissiton
                    </Text>
                  </Flex>
                </Checkbox>
                <Checkbox
                  name="Private"
                  onChange={(e) => communityTypeChangeHandler(e)}
                  isChecked={communityType === "Private" ? true : false}>
                  <Flex align="center" gap={2}>
                    <Icon fontWeight={700} as={HiLockClosed} />
                    <Text fontSize={17} fontWeight={700}>
                      Private
                    </Text>
                    <Text color="gray.500">
                      Only permited users can view, update and comment posts
                    </Text>
                  </Flex>
                </Checkbox>
              </Stack>
            </Box>
          </ModalBody>
        </Box>

        <ModalFooter borderRadius="0px 0px 20px 20px" bg="gray.100">
          <Button
            colorScheme="blue"
            fontSize={17}
            variant="outline"
            mr={3}
            onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button
            fontSize={17}
            variant="solid"
            isLoading={loading}
            onClick={createCommunityHandler}>
            Create community
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateComunityModal;
