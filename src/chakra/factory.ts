import Image from "next/image";
import { chakra } from "@chakra-ui/react";

export const CImage = chakra(Image, {
  shouldForwardProp: (prop) => ["height", "width", "src", "alt"].includes(prop)
});
