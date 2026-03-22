import { useEffect, useState } from "react";

export const useImageAspectRatio = (src: string | undefined) => {
  const [ratio, setRatio] = useState<string>("1 / 1");

  useEffect(() => {
    if (!src) return;

    const img = new Image();
    img.src = src;

    const handle = () => {
      const ratio = img.naturalWidth / img.naturalHeight;
      setRatio(r >= 1.2 ? "4 / 3" : "1 / 1");
    };

    if (img.complete) {
      handle();
    } else {
      img.onload = handle;
    }
  }, [src]);

  return ratio;
};
