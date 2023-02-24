import { useRecoilState } from "recoil";
import { postState } from "@/atoms/postsAtom";

export const usePosts = () => {
  const [postStateValue, setPostStateValue] = useRecoilState(postState);

  const onVote = async () => {};

  const onSelectPost = () => {};

  const onDeletePost = async () => {};

  return {
    onVote,
    onSelectPost,
    onDeletePost,
    postStateValue,
    setPostStateValue
  };
};
