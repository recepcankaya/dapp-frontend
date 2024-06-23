"use client";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Circle, CircleDot } from "lucide-react";

import CarouselModal from "./CarouselModal";
import type { AdminCampaigns } from "@/src/lib/types/jsonQuery.types";

// p-4 *:w-4 *h:4 duruma göre yeniden ayarlanacak
const BUTTON_STYLES =
  "block absolute top-0 bottom-0 p-4 cursor-pointer transition-colors ease-in-out hover:bg-black/20 *:stroke-white *:fill-black *:w-4 *h:4";

export default function CampaignCarousel({
  campaigns,
}: {
  campaigns: AdminCampaigns["campaigns"];
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  const showNextImage = useCallback(() => {
    setImageIndex((index: number) => {
      if (index === (campaigns?.length ?? 0) - 1) return 0;
      return index + 1;
    });
  }, [campaigns]);

  useEffect(() => {
    const interval = setInterval(() => {
      showNextImage();
    }, 4000);

    return () => clearInterval(interval);
  }, [imageIndex, showNextImage]);

  if (!campaigns) return null;

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          overflow: "hidden",
        }}>
        {campaigns.map((camp) => (
          <img
            key={camp.campaign_id}
            src={camp.campaign_image}
            alt={String(camp.campaign_name)}
            style={{
              objectFit: "cover",
              width: "100%",
              height: "100%",
              display: "block",
              translate: `${imageIndex * -100}%`,
              flexShrink: 0,
              flexGrow: 0,
              transition: "translate 300ms ease-in-out",
            }}
          />
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          bottom: ".5rem",
          left: "50%",
          translate: "-50%",
          display: "flex",
          gap: ".5rem",
        }}>
        {campaigns.map((_, index) => (
          <div key={index} style={{ width: ".75rem", height: ".75rem" }}>
            {index === imageIndex ? (
              <CircleDot
                style={{
                  fill: "blue",
                  stroke: "white",
                  height: "100%",
                  width: "100%",
                }}
              />
            ) : (
              <Circle
                style={{
                  fill: "blue",
                  stroke: "white",
                  height: "100%",
                  width: "100%",
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
