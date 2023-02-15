import { firestore } from "@/firebase/clientApp";
import { doc, getDoc } from "firebase/firestore";
import { GetServerSidePropsContext } from "next";
import { Community } from "@/types";
import React from "react";

type CommunityPageProps = {
  communityData: Community;
};

const communityPage: React.FC<CommunityPageProps> = ({ communityData }) => {
  return <div>{communityData.id}</div>;
};

export default communityPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    const communityDocRef = doc(firestore, "communities", context.query.communityId as string);

    const communityDocData = (await getDoc(communityDocRef)).data;

    return {
      props: {
        communityData: communityDocData
      } // will be passed to the page component as props
    };
  } catch (err) {}
}
