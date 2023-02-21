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

type setTextInputs = (value: string) => void;

const NewPostForm: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<string>(formTabs[0].title);
  const [textInputs, setTextInputs] = useState<textInputsState>({
    title: "",
    description: ""
  });

  const handleCreatePost = async () => {};

  const handlePostInputsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTextInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
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
        <TextInputs inputsValues={textInputs} changeInuptsValues={handlePostInputsChange} />
      </Flex>
    </Flex>
  );
};

export default NewPostForm;
