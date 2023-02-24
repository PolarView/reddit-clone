import React, { useEffect, useRef, useState } from "react";
import { Flex, Text, Button, Box, Image, Input } from "@chakra-ui/react";
import { CImage } from "@/chakra/factory";

type UplaodImageOrVideoProps = {
  handleUploadAsset: (e: React.ChangeEvent<HTMLInputElement>) => void;
  videoAsset: null | string;
  imageAsset: null | string;
  resetAsset: () => void;
};

const UplaodImageOrVideo: React.FC<UplaodImageOrVideoProps> = ({
  handleUploadAsset,
  videoAsset,
  imageAsset,
  resetAsset
}) => {
  const assetRef = useRef<HTMLInputElement>(null);

  const [isAsset, setIsAsset] = useState(false);

  useEffect(() => {
    if (videoAsset || imageAsset) {
      setIsAsset(true);
    } else {
      setIsAsset(false);
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
        <Box position="relative">
          {videoAsset && <video src={videoAsset} loop={true} controls></video>}
          {imageAsset && <CImage src={imageAsset} width={700} height={500} alt="Post picture" />}
          {isAsset && (
            <Button
              fontWeight={600}
              fontSize={24}
              variant="unstyled"
              position="absolute"
              top={0}
              right={0}
              color="white"
              opacity="0.7"
              onClick={resetAsset}>
              x
            </Button>
          )}
        </Box>
      )}
    </Flex>
  );
};

export default UplaodImageOrVideo;
