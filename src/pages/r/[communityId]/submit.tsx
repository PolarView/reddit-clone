import { Flex, Box, Text } from "@chakra-ui/react";
import PageContentLayout from "@/components/Layout/PageContentLayout";
import NewPostForm from "@/components/Posts/NewPostForm";

const submit: React.FC = () => {
  return (
    <>
      <PageContentLayout>
        <>
          <Box borderBottom="2px solid white" pb={4} mb={2}>
            <Text fontWeight={600} fontSize={18}>
              Create your post
            </Text>
          </Box>
          <NewPostForm />
        </>
        <>right</>
      </PageContentLayout>
    </>
  );
};

export default submit;
