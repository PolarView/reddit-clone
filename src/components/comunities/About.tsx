import React, { use, useRef, useState } from "react";
import {
  Box,
  Button,
  Divider,
  Flex,
  Icon,
  Skeleton,
  SkeletonCircle,
  Stack,
  Text,
  Image,
  Spinner
} from "@chakra-ui/react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { RiCakeLine } from "react-icons/ri";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore, storage } from "../../firebase/clientApp";
import { communityState } from "../../atoms/communitiesAtom";
import { Community } from "@/types";
import moment from "moment";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { FaReddit } from "react-icons/fa";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import { useUpdateCommunityAva } from "@/hooks/useUpdateCommunityAva";

type AboutProps = {
  communityData: Community;
};

const About: React.FC<AboutProps> = ({ communityData }) => {
  const {
    selectedFile,
    setSelectedFile,
    updateCommunityImage,
    handleSelectImage,
    loadingCommunityAva,
    error
  } = useUpdateCommunityAva();
  const [user] = useAuthState(auth);
  const communityImageRef = useRef<HTMLInputElement>(null);

  return (
    <Box position="sticky" top="14px">
      <Flex
        justify="space-between"
        align="center"
        p={3}
        color="white"
        bg="blue.400"
        borderRadius="4px 4px 0px 0px">
        <Text fontSize="10pt" fontWeight={700}>
          About Community
        </Text>
        <Icon as={HiOutlineDotsHorizontal} cursor="pointer" />
      </Flex>
      <Flex direction="column" p={3} bg="white" borderRadius="0px 0px 4px 4px">
        <>
          <Stack spacing={2}>
            <Flex width="100%" p={2} fontWeight={600} fontSize="10pt">
              <Flex direction="column" flexGrow={1}>
                <Text>{communityData?.numberOfMembers?.toLocaleString()}</Text>
                <Text>Members</Text>
              </Flex>
              <Flex direction="column" flexGrow={1}>
                <Text>1</Text>
                <Text>Online</Text>
              </Flex>
            </Flex>
            <Divider />
            <Flex align="center" width="100%" p={1} fontWeight={500} fontSize="10pt">
              <Icon as={RiCakeLine} mr={2} fontSize={18} />
              {communityData?.createdAt && (
                <Text>
                  Created{" "}
                  {moment(new Date(communityData.createdAt!.seconds * 1000)).format("MMM DD, YYYY")}
                </Text>
              )}
            </Flex>

            {/* !!!ADDED AT THE VERY END!!! INITIALLY DOES NOT EXIST */}
            {user?.uid === communityData?.creatorId && (
              <>
                <Divider />
                <Stack fontSize="10pt" spacing={1}>
                  <Text fontWeight={600}>Admin</Text>
                  <Flex align="center" justify="space-between">
                    <Text
                      color="blue.500"
                      cursor="pointer"
                      _hover={{ textDecoration: "underline" }}
                      onClick={() => communityImageRef.current?.click()}>
                      Change Image
                    </Text>
                    {communityData?.imageUrl || selectedFile ? (
                      <Image
                        borderRadius="full"
                        boxSize="40px"
                        src={selectedFile || communityData?.imageUrl}
                        alt="Dan Abramov"
                      />
                    ) : (
                      <Icon as={FaReddit} fontSize={40} color="brand.100" mr={2} />
                    )}
                  </Flex>
                  {selectedFile &&
                    (loadingCommunityAva ? (
                      <Spinner />
                    ) : (
                      <Text
                        cursor="pointer"
                        onClick={() => {
                          updateCommunityImage(communityData);
                        }}>
                        Save Changes
                      </Text>
                    ))}
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/x-png,image/gif,image/jpeg"
                    hidden
                    ref={communityImageRef}
                    onChange={handleSelectImage}
                  />
                </Stack>
              </>
            )}
          </Stack>
        </>
      </Flex>
    </Box>
  );
};

export default About;
