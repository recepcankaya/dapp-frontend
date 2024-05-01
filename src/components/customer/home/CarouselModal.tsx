"use client";
import { Campaign } from "@/src/lib/types/jsonQuery.types";
import Image from "next/image";

type CarouselModalProps = {
  campaign: Campaign;
  setIsModalOpen: (value: boolean) => void;
};

export default function CarouselModal({
  campaign,
  setIsModalOpen,
}: CarouselModalProps) {
  return (
    <div
      className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-10"
      onClick={() => setIsModalOpen(false)}>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-52 min-[375px]:h-60 min-[425px]:h-80 min-[600px]:h-96 w-full">
        <Image
          src={campaign.campaign_image.replace(
            "ipfs://",
            "https://ipfs.io/ipfs/"
          )}
          alt="campaign image"
          fill
          sizes="100vw"
          style={{
            objectFit: "contain",
          }}
        />
      </div>
    </div>
  );
}
