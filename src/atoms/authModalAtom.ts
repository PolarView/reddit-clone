import { atom } from "recoil";

export interface AuthModalType {
  open: boolean;
  view: "login" | "signup" | "resetPassword";
}

const defaultModalState: AuthModalType = {
  open: false,
  view: "login"
};

const authModalState = atom<AuthModalType>({
  key: "authModal",
  default: defaultModalState
});

export default authModalState;
