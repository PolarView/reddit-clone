import React, { useEffect } from "react";
import { firestore } from "@/firebase/clientApp";
import { doc, getDoc } from "firebase/firestore";
import { GetServerSidePropsContext } from "next";
import { Community } from "@/types";
import safeJsonStringify from "safe-json-stringify";
import NotFound from "@/components/comunities/NotFound";
import Header from "@/components/comunities/Header";
import PageContentLayout from "@/components/Layout/PageContentLayout";
import CreatePostLink from "@/components/comunities/CreatePostLink";
import Posts from "@/components/Posts/Posts";
import { useSetRecoilState } from "recoil";
import { communityState } from "@/atoms/communitiesAtom";
import About from "@/components/comunities/About";
type CommunityPageProps = {
  communityData: Community;
};

const communityPage: React.FC<CommunityPageProps> = ({ communityData }) => {
  if (!communityData) return <NotFound />;

  const setCommunityState = useSetRecoilState(communityState);
  useEffect(() => {
    setCommunityState((prev) => ({
      ...prev,
      currentCommunity: communityData
    }));
    console.log("communityData");
  }, [communityData]);

  return (
    <>
      <Header communityData={communityData} />
      <PageContentLayout>
        <>
          <CreatePostLink />
          <Posts communityData={communityData} />
        </>
        <>
          <About communityData={communityData} />
        </>
      </PageContentLayout>
    </>
  );
};

export default communityPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    const communityDocRef = doc(firestore, "communities", context.query.communityId as string);

    const communityDoc = await getDoc(communityDocRef);

    return {
      props: {
        communityData: communityDoc.exists()
          ? JSON.parse(safeJsonStringify({ id: communityDoc.id, ...communityDoc.data() }))
          : ""
      }
    };
  } catch (err) {}
}
