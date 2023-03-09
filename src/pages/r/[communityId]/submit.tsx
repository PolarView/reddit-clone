import { Flex, Box, Text } from "@chakra-ui/react";
import PageContentLayout from "@/components/Layout/PageContentLayout";
import NewPostForm from "@/components/Posts/NewPostForm";
import { auth } from "@/firebase/clientApp";
import { useAuthState } from "react-firebase-hooks/auth";
import About from "@/components/comunities/About";
import { useCommunityData } from "@/hooks/useCommunityData";

const submit: React.FC = () => {
  const [user] = useAuthState(auth);
  const { communityStateValue } = useCommunityData();

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
        <>
          {communityStateValue.currentCommunity && (
            <About communityData={communityStateValue.currentCommunity} />
          )}
        </>
      </PageContentLayout>
    </>
  );
};

export default submit;
