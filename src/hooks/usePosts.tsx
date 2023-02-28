import { useRecoilState } from "recoil";
import { postState } from "@/atoms/postsAtom";
import { Post } from "@/atoms/postsAtom";
import { firestore, storage } from "@/firebase/clientApp";
import { deleteObject, ref } from "firebase/storage";
import { deleteDoc, doc } from "firebase/firestore";

export const usePosts = () => {
  const [postStateValue, setPostStateValue] = useRecoilState(postState);

  const onVote = async () => {};

  const onSelectPost = () => {};

  const onDeletePost = async (post: Post): Promise<boolean> => {
    try {
      // check if post has an asset
      if (post.assetUrl) {
        const assetRef = ref(storage, `posts/${post.id}/${post.assetUrl.assetType}`);
        await deleteObject(assetRef);
      }

      // delete post from db
      const postDocRef = doc(firestore, "posts", post.id!);
      await deleteDoc(postDocRef);

      // update state to rerender the DOM
      setPostStateValue((prev) => ({
        ...prev,
        posts: prev.posts.filter((item) => item.id !== post.id)
      }));

      return true;
    } catch (err: any) {
      console.log(err.message);
      return false;
    }
  };

  return {
    onVote,
    onSelectPost,
    onDeletePost,
    postStateValue,
    setPostStateValue
  };
};
