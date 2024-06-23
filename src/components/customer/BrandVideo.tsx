"use client";
import useScreenSize from "@/src/hooks/useScreenSize";

const maxWidth = 560;

export default function BrandVideo({
  brandVideo,
}: {
  brandVideo: BrandBranch["video_url"];
}) {
  const { containerWidth, setContainerRef } = useScreenSize();

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
