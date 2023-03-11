import { useSetRecoilState } from "recoil";
import { Community } from "@/types";
import { useState } from "react";
import { ref, getDownloadURL, uploadString } from "firebase/storage";
import { storage, firestore } from "@/firebase/clientApp";
import { updateDoc, doc, query, collection, where } from "firebase/firestore";
import { communityState } from "../atoms/communitiesAtom";

const imageAssetTypes = ["image/jpg", "image/png", "image/jpeg", "image/gif"];

export const useUpdateCommunityAva = () => {
  const [selectedFile, setSelectedFile] = useState<null | string>(null);
  const [error, setError] = useState<boolean>(false);
  const [loadingCommunityAva, setLoadingCommunityAva] = useState<boolean>(false);
  const setCommunityStateValue = useSetRecoilState(communityState);

  const updateCommunityImage = async (communityData: Community) => {
    try {
      if (selectedFile) {
        setLoadingCommunityAva(true);
        const imageRef = ref(storage, `communities/${communityData.id}/image`);
        await uploadString(imageRef, selectedFile, "data_url");
        const downloadURL = await getDownloadURL(imageRef);
        await updateDoc(doc(firestore, "communities", communityData.id), {
          imageUrl: downloadURL
        });
        console.log("HERE IS DOWNLOAD URL", downloadURL);

        setCommunityStateValue((prev) => ({
          ...prev,
          currentCommunity: {
            ...prev.currentCommunity,
            imageUrl: downloadURL
          } as Community
        }));

        //TODO: to make a communityImageUrl in post update
        // const postsRef = query(
        //   collection(firestore, "posts"),
        //   where("communityId", "==", communityData.id)
        // );

        setLoadingCommunityAva(false);
        setError(false);
      }
    } catch (err: any) {
      setLoadingCommunityAva(false);
      setError(true);
    }
  };

  const handleSelectImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    //selecting and updating state with input image file
    const fileType = event.target.files![0].type;

    if (imageAssetTypes.includes(fileType)) {
      const reader = new FileReader();
      if (event.target.files?.[0]) {
        reader.readAsDataURL(event.target.files[0]);
      }

      reader.onload = (readerEvent) => {
        if (readerEvent.target?.result) {
          setSelectedFile(readerEvent.target?.result as string);
        }
      };
    }
  };
  return {
    updateCommunityImage,
    selectedFile,
    setSelectedFile,
    handleSelectImage,
    loadingCommunityAva,
    error
  };
};
