import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Flex, Icon, Input, Stack, Textarea, Image } from "@chakra-ui/react";
import { User } from "firebase/auth";
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { BiPoll } from "react-icons/bi";
import { BsLink45Deg, BsMic } from "react-icons/bs";
import { IoDocumentText, IoImageOutline } from "react-icons/io5";
import { AiFillCloseCircle } from "react-icons/ai";
import { useRecoilState, useSetRecoilState } from "recoil";
import { firestore, storage } from "../../firebase/clientApp";
import NewPostTab from "./NewPostTab";
import TextInputs from "./PostForm/TextInputs";
import UplaodImageOrVideo from "./PostForm/UplaodImageOrVideo";

const formTabs = [
  {
    title: "Post",
    icon: IoDocumentText
  },
  {
    title: "Images & Video",
    icon: IoImageOutline
  },
  {
    title: "Link",
    icon: BsLink45Deg
  },
  {
    title: "Poll",
    icon: BiPoll
  },
  {
    title: "Talk",
    icon: BsMic
  }
];

export type TabItem = {
  title: string;
  icon: typeof Icon.arguments;
};

export type textInputsState = {
  title: string;
  description: string;
};

const videoAssetTypes = ["video/mp4", "video/webm", "video/ogg"];
const imageAssetTypes = ["image/jpg", "image/png", "image/jpeg", "image/gif"];

const NewPostForm: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<string>(formTabs[0].title);
  const [textInputs, setTextInputs] = useState<textInputsState>({
    title: "",
    description: ""
  });
  const [loading, setLoading] = useState(false);
  const [videoAsset, setVideoAsset] = useState<null | string>(null);

  const [imageAsset, setImageAsset] = useState<null | string>(null);

  const handleUploadAsset = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileType = event.target.files![0].type;
    if (videoAssetTypes.includes(fileType)) {
      const reader = new FileReader();
      if (event.target.files?.[0]) {
        reader.readAsDataURL(event.target.files[0]);
      }

      reader.onload = (readerEvent) => {
        if (readerEvent.target?.result) {
          setVideoAsset(readerEvent.target?.result as string);
          setImageAsset(null);
        }
      };
    } else if (imageAssetTypes.includes(fileType)) {
      const reader = new FileReader();
      if (event.target.files?.[0]) {
        reader.readAsDataURL(event.target.files[0]);
      }

      reader.onload = (readerEvent) => {
        if (readerEvent.target?.result) {
          setImageAsset(readerEvent.target?.result as string);
          setVideoAsset(null);
        }
      };
    }
  };

  const handleCreatePost = async () => {};

  const handlePostInputsChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const {
      target: { name, value }
    } = event;

    setTextInputs((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Flex direction="column" bg="white" borderRadius={4} mt={2}>
      <Flex width="100%">
        {formTabs.map((tab) => (
          <NewPostTab
            key={tab.title}
            tabInfo={tab}
            isSelectedTab={tab.title === selectedTab}
            setSelectedTab={setSelectedTab}
          />
        ))}
      </Flex>
      <Flex p={4}>
        {selectedTab === "Post" && (
          <TextInputs
            inputsValues={textInputs}
            changeInuptsValues={handlePostInputsChange}
            createPost={handleCreatePost}
            loading={loading}
          />
        )}
        {selectedTab === "Images & Video" && (
          <UplaodImageOrVideo
            handleUploadAsset={handleUploadAsset}
            videoAsset={videoAsset}
            imageAsset={imageAsset}
          />
        )}
      </Flex>
    </Flex>
  );
};

export default NewPostForm;
