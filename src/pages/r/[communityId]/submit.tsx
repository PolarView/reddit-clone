import { Flex, Box, Text } from "@chakra-ui/react";
import PageContentLayout from "@/components/Layout/PageContentLayout";
import NewPostForm from "@/components/Posts/NewPostForm";
import { auth } from "@/firebase/clientApp";
import { useAuthState } from "react-firebase-hooks/auth";

const submit: React.FC = () => {
  const [user] = useAuthState(auth);

  return (
    <>
      <PageContentLayout>
        <>
          <Box borderBottom="2px solid white" pb={4} mb={2}>
            <Text fontWeight={600} fontSize={18}>
              Create your post
            </Text>
          </Box>
          {user && <NewPostForm user={user} />}
        </>
        <>right</>
      </PageContentLayout>
    </>
  );
};

export default submit;
