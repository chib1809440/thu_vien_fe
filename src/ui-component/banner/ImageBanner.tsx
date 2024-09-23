import React from "react";
interface PropsImage {
  src: string;
  alt: string;
}
function ImageBanner({ src, alt }: PropsImage) {
  return <img src={src} alt={alt}></img>;
}

export default ImageBanner;
