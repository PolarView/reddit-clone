import { Community } from "./../types.d";
import { atom } from "recoil";
import { CommunitySnippets } from "@/types";

type CommunityState = {
  mySnippets: CommunitySnippets[];
  currentCommunity?: Community;
  snippetsFetched: boolean;
};

export const defaultCommunity: Community = {
  id: "",
  creatorId: "",
  numberOfMembers: 0,
  communityType: "Public"
};

const defaultCommunityState: CommunityState = {
  mySnippets: [],
  currentCommunity: defaultCommunity,
  snippetsFetched: false
};

export const communityState = atom<CommunityState>({
  key: "comunityState",
  default: defaultCommunityState
});
