import { Button } from "@chakra-ui/react";
import React from "react";
import Link from "next/link";
import { Flex, Text } from "@chakra-ui/react";

const NotFound: React.FC = () => {
  return (
    <>
      <Flex minHeight="60vh" justify="center" direction="column" gap={3} align="center">
        <Text fontSize="20px" fontWeight={600}>
          Sorry, but this community doesnt exist or has been banned...
        </Text>
        <Link href="/">
          <Button fontSize="20px" padding="4px 50px" variant="solid">
            Go Home
          </Button>
        </Link>
      </Flex>
    </>
  );
};

export default NotFound;
