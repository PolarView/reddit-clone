import { Timestamp } from "firebase/firestore";
import { atom } from "recoil";

export type Post = {
  id?: string;
  communityId: string;
  creatorId: string;
  creatorDisplayName: string;
  title: string;
  body: string;
  numberOfComments: number;
  voteStatus: number;
  assetUrl?: {
    url: string;
    assetType: string;
  };
  communityImageUrl?: string;
  createdAt: Timestamp;
};

type PostState = {
  selectedPost: Post | null;
  posts: Post[];
  //TODO - votes
};

const defualtPostState: PostState = {
  selectedPost: null,
  posts: []
};

export const postState = atom<PostState>({
  key: "postState",
  default: defualtPostState
});
