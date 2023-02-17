import React from "react";
import { firestore } from "@/firebase/clientApp";
import { doc, getDoc, Timestamp } from "firebase/firestore";
import { GetServerSidePropsContext } from "next";
import { Community } from "@/types";
import safeJsonStringify from "safe-json-stringify";
import NotFound from "@/components/comunities/NotFound";
import Header from "@/components/comunities/Header";
import PageContentLayout from "@/components/Layout/PageContentLayout";
type CommunityPageProps = {
  communityData: Community;
};

const communityPage: React.FC<CommunityPageProps> = ({ communityData }) => {
  if (!communityData) return <NotFound />;
  return (
    <>
      <Header communityData={communityData} />
      <PageContentLayout>
        <>left</>
        <>right</>
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
