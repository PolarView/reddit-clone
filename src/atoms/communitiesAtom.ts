import { atom } from "recoil";
import { CommunitySnippets } from "@/types";

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
