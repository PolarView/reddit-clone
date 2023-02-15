import { atom } from "recoil";

export interface AuthModalType {
  open: boolean;
  view: "login" | "signup" | "resetPassword";
}

const defaultModalState: AuthModalType = {
  open: false,
  view: "login"
};

export const authModalState = atom<AuthModalType>({
  key: "authModal",
  default: defaultModalState
});
