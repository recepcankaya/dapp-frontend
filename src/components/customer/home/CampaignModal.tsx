"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import { Campaign } from "@/src/lib/types/jsonQuery.types";

export default function CampaignModal({
  favouriteCampaign,
}: {
  favouriteCampaign: Campaign | null;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  let hasShownCampaignModal: unknown;
  if (typeof window !== "undefined") {
    hasShownCampaignModal = window.localStorage.getItem(
      "hasShownCampaignModal"
    );
  }

  useEffect(() => {
    // Set to true initially
    window.localStorage.setItem("hasShownCampaignModal", "true");
    // Set to false when window is closed
    window.onbeforeunload = () => {
      window.localStorage.setItem("hasShownCampaignModal", "false");
    };

    // Cleanup function to remove the event listener
    return () => {
      window.onbeforeunload = null;
    };
  }, []);

  useEffect(() => {
    if (hasShownCampaignModal === "false") {
      setIsModalOpen(true);
    }
  }, [hasShownCampaignModal]);

  useEffect(() => {
    if (isModalOpen && favouriteCampaign) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen, favouriteCampaign]);

  if (!favouriteCampaign) {
    return null;
  }

  return (
    <>
      {isModalOpen && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-10"
          onClick={() => setIsModalOpen(false)}
        >
          <div className="h-3/4 relative top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full">
            <Image
              src={favouriteCampaign.campaign_image.replace(
                "ipfs://",
                "https://ipfs.io/ipfs/"
              )}
              alt="campaign image"
              fill
              sizes="100vw"
              priority
              className="object-contain w-full h-full"
            />
          </div>
        </div>
      )}
    </>
  );
}
