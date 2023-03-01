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

export type PostVote = {
  id?: string;
  communityId: string;
  voteValue: number;
  postId: string;
};

type PostState = {
  selectedPost: Post | null;
  posts: Post[];
  postVotes: PostVote[];
};

const defualtPostState: PostState = {
  selectedPost: null,
  posts: [],
  postVotes: []
};

export const postState = atom<PostState>({
  key: "postState",
  default: defualtPostState
});
