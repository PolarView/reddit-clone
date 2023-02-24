import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Flex,
  Icon,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription
} from "@chakra-ui/react";
import { User } from "firebase/auth";
import { addDoc, collection, doc, serverTimestamp, Timestamp, updateDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { BiPoll } from "react-icons/bi";
import { BsLink45Deg, BsMic } from "react-icons/bs";
import { IoDocumentText, IoImageOutline } from "react-icons/io5";
import { AiFillCloseCircle } from "react-icons/ai";
import { useRecoilState, useSetRecoilState } from "recoil";
import { firestore, storage } from "../../firebase/clientApp";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import NewPostTab from "./NewPostTab";
import TextInputs from "./PostForm/TextInputs";
import UplaodImageOrVideo from "./PostForm/UplaodImageOrVideo";
import { Post } from "@/atoms/postsAtom";

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

type NewPostFormProps = {
  user: User;
};

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

const NewPostForm: React.FC<NewPostFormProps> = ({ user }) => {
  const [selectedTab, setSelectedTab] = useState<string>(formTabs[0].title);
  const [textInputs, setTextInputs] = useState<textInputsState>({
    title: "",
    description: ""
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<null | string>(null);
  const [errorStatus, setErrorStatus] = useState<boolean>(false);

  const [videoAsset, setVideoAsset] = useState<null | string>(null);
  const [imageAsset, setImageAsset] = useState<null | string>(null);
  const [currentAssetType, setCurrentAssetType] = useState<null | string>(null);

  const router = useRouter();

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
          setCurrentAssetType("video");
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
          setCurrentAssetType("image");
          setVideoAsset(null);
        }
      };
    }
  };

  const resetAsset = () => {
    if (videoAsset) setVideoAsset(null);
    else if (imageAsset) setImageAsset(null);
  };

  const handleCreatePost = async () => {
    const { communityId } = router.query;

    //create a Post and post type
    const newPost: Post = {
      communityId: communityId as string,
      creatorId: user.uid,
      creatorDisplayName: user.email!.split("@")[0],
      createdAt: serverTimestamp() as Timestamp,
      title: textInputs.title,
      body: textInputs.description,
      numberOfComments: 0,
      voteStatus: 0
    };

    try {
      setLoading(true);
      //add a post to db
      const postDocRef = await addDoc(collection(firestore, "posts"), newPost);

      // check if and type of selected file
      if (videoAsset || imageAsset) {
        const assetRef = ref(storage, `posts/${postDocRef.id}/${currentAssetType}`);
        const asset = videoAsset || imageAsset;
        await uploadString(assetRef, asset as string, "data_url");
        const downloadAssetUrl = await getDownloadURL(assetRef);

        // add an imageUrl to the post in db
        await updateDoc(postDocRef, {
          assetUrl: {
            url: downloadAssetUrl,
            assetType: videoAsset ? "video" : "image"
          }
        });
      }

      router.back();
      setLoading(false);
      setErrorStatus(false);
    } catch (err: any) {
      setErrorMessage(err.message);
      setErrorStatus(true);
      console.log(`error occured duaring handleCreatePost, ${errorMessage}`);
      setLoading(false);
    }
  };

  const handleCancelPost = () => {
    setTextInputs({ title: "", description: "" });
    setVideoAsset(null);
    setImageAsset(null);
    router.push(`/r/${router.query.communityId}`);
  };

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
            resetAsset={resetAsset}
          />
        )}
      </Flex>
      <Flex justify="flex-end" gap={4} p={2}>
        <Button variant="outline" height="34px" padding="0px 40px" onClick={handleCancelPost}>
          Cancel
        </Button>
        <Button
          height="34px"
          padding="0px 30px"
          isLoading={loading}
          disabled={!textInputs.title}
          onClick={handleCreatePost}>
          Post
        </Button>
      </Flex>
      {errorStatus && (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>Error duaring creating a post!</AlertTitle>
        </Alert>
      )}
    </Flex>
  );
};

export default NewPostForm;
