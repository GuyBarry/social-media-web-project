import { useEffect, useState } from "react";

/**
 * Loads an image from the given URL and returns the CSS `aspect-ratio`
 * string that best matches the image's natural dimensions.
 *
 * Recognised ratios:
 *  - `"4 / 3"` — landscape (natural ratio ≥ 1.2)
 *  - `"1 / 1"`  — square  (everything else / default)
 */
export const useImageAspectRatio = (src: string | undefined) => {
  const [ratio, setRatio] = useState<string>("1 / 1");

  useEffect(() => {
    if (!src) return;

    const img = new Image();
    img.src = src;

    const handle = () => {
      const r = img.naturalWidth / img.naturalHeight;
      // 4:3 ≈ 1.333 — use a generous threshold to account for minor rounding
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
