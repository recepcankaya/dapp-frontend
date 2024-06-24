"use client";
import Image from "next/image";
import type { Campaign } from "@/src/lib/types/jsonQuery.types";

type CarouselModalProps = {
  campaign: Campaign;
  setIsModalOpen: (value: boolean) => void;
};

/**
 * Renders a modal component for displaying a carousel.
 *
 * @param {Object} props.campaign - The campaign object.
 * @param {boolean} props.setIsModalOpen - A function to set the modal open state.
 */
export default function CarouselModal({
  campaign,
  setIsModalOpen,
}: CarouselModalProps) {
  return (
    <div
      className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-10"
      onClick={() => setIsModalOpen(false)}
    >
      <div className="h-3/4 w-full relative top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-[768px] aspect-video">
        <Image
          src={campaign.campaign_image}
          alt="campaign image"
          width={0}
          height={0}
          sizes="100vw"
          className="object-contain w-full h-full"
        />
      </div>
    </div>
  );
}
