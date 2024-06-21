"use client";

import { useCallback, useState } from "react";
import { useResizeObserver } from "@wojtekmaj/react-hooks";

const resizeObserverOptions = {};

const maxWidth = 560;

export default function BrandVideo({
  brandVideo,
}: {
  brandVideo: BrandBranch["video_url"];
}) {
  const [containerRef, setContainerRef] = useState<HTMLElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>();

  const onResize = useCallback<ResizeObserverCallback>((entries) => {
    const [entry] = entries;

    if (entry) {
      setContainerWidth(entry.contentRect.width);
    }
  }, []);

  useResizeObserver(containerRef, resizeObserverOptions, onResize);
  return (
    <section
      className="w-screen pt-12 pb-12 flex justify-center"
      ref={setContainerRef}>
      {brandVideo ? (
        <iframe
          src={brandVideo}
          width={containerWidth ? Math.min(containerWidth, maxWidth) : maxWidth}
          height={
            containerWidth
              ? (Math.min(containerWidth, maxWidth) * 9) / 16
              : (maxWidth * 9) / 16
          }
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen></iframe>
      ) : (
        "No video available."
      )}
    </section>
  );
}
