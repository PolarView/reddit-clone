import { Timestamp } from "firebase/firestore";

export type userSignupForm = {
  email: string;
  password: string;
  confirmPassword: string;
};

export type userLoginForm = {
  email: string;
  password: string;
};

export type Community = {
  id: string;
  creatorId: string;
  communityType: "Public" | "Restricted" | "Private";
  numberOfMembers: number;
  createdAt?: Timestamp;
  imageUrl?: string;
};

export type CommunitySnippets = {
  communityId: string;
  isModerator?: boolean;
  imageUrl?: string;
};
