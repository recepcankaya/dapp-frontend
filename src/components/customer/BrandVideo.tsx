"use client";
import Video from "next-video";

export default function BrandVideo({
  brandVideo,
}: {
  brandVideo: BrandBranch["video_url"];
}) {
  console.log(brandVideo);
  return (
    <section className="w-screen pt-12 pb-24">
      {brandVideo ? <Video src={brandVideo} /> : "No video available."}
    </section>
  );
}
