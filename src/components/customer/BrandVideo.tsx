"use client";
import Video from "next-video";

export default function BrandVideo({ brandVideo }: { brandVideo: string }) {
  console.log(brandVideo);
  return (
    <section className="w-screen pt-12 pb-24">
      <Video src={brandVideo} />
    </section>
  );
}
