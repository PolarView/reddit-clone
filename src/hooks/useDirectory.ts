import { communityState } from "./../atoms/communitiesAtom";
import { useRouter } from "next/router";
import { useRecoilState, useRecoilValue } from "recoil";
import { defaultMenuItem, DirectoryMenuItem, directoryMenuState } from "@/atoms/directoryMenuAtom";
import { useEffect } from "react";
import { FaReddit } from "react-icons/fa";

export const useDirectory = () => {
  const [directoryState, setDirectoryState] = useRecoilState(directoryMenuState);
  const communityStateValue = useRecoilValue(communityState);
  const router = useRouter();

  useEffect(() => {
    const { community } = router.query;

    const existingCommunity = communityStateValue.currentCommunity;

    if (existingCommunity?.id) {
      setDirectoryState((prev) => ({
        ...prev,
        selectedMenuItem: {
          displayText: `r/${existingCommunity.id}`,
          link: `r/${existingCommunity.id}`,
          icon: FaReddit,
          iconColor: "blue.500",
          imageUrl: existingCommunity.imageUrl
        }
      }));
      return;
    }
    setDirectoryState((prev) => ({
      ...prev,
      selectedMenuItem: defaultMenuItem
    }));
  }, [communityStateValue.currentCommunity]);

  const toggleMenuOpen = () => {
    setDirectoryState((prev) => ({ ...prev, isOpen: !prev.isOpen }));
    console.log(directoryState.isOpen);
  };
  const selectMenuItem = (menuItem: DirectoryMenuItem) => {
    setDirectoryState({ isOpen: false, selectedMenuItem: menuItem });
    router.push(menuItem.link);
  };

  return {
    toggleMenuOpen,
    selectMenuItem,
    directoryState
  };
};
