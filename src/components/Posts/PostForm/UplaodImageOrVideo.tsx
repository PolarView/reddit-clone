import React, { useEffect, useRef, useState } from "react";
import { Flex, Text, Button, Box, Image, Input } from "@chakra-ui/react";
import { CImage } from "@/chakra/factory";

type UplaodImageOrVideoProps = {
  handleUploadAsset: (e: React.ChangeEvent<HTMLInputElement>) => void;
  videoAsset: null | string;
  imageAsset: null | string;
};

const UplaodImageOrVideo: React.FC<UplaodImageOrVideoProps> = ({
  handleUploadAsset,
  videoAsset,
  imageAsset
}) => {
  const assetRef = useRef<HTMLInputElement>(null);

  const [isAsset, setIsAsset] = useState(false);

  useEffect(() => {
    if (videoAsset || imageAsset) {
      setIsAsset(true);
    }
  }, [videoAsset, imageAsset]);

  return (
    <Flex width="100%" justify="center" align="center">
      {!isAsset ? (
        <Flex py={36} border="1px dashed gray" justify="center" align="center" width="100%">
          <Button
            variant="solid"
            px={12}
            onClick={() => {
              assetRef.current?.click();
            }}>
            Upload
          </Button>
          <input ref={assetRef} type="file" hidden onChange={(e) => handleUploadAsset(e)} />
        </Flex>
      ) : (
        <>
          {videoAsset && <video src={videoAsset} loop={true} controls></video>}
          {imageAsset && <CImage src={imageAsset} width={700} height={400} alt="Post picture" />}
        </>
      )}
    </Flex>
  );
};

export default UplaodImageOrVideo;
