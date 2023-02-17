import { atom } from "recoil";

export type CommunitySnippets = {
  communityId: string;
  isModerator?: boolean;
  imageURL?: string;
};

type CommunityState = {
  mySnippets: CommunitySnippets[];
};

const defaultCommunityState: CommunityState = {
  mySnippets: []
};

export const communityState = atom<CommunityState>({
  key: "comunityState",
  default: defaultCommunityState
});
