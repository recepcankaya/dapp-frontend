"use client";
// RE-IMPLEMENTATION OF SLIDER AND REFACTORING OF ResizeObserver
import { useState, useCallback } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { useResizeObserver } from "@wojtekmaj/react-hooks";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import CarouselModal from "./CarouselModal";
import type { AdminCampaigns } from "@/src/lib/types/jsonQuery.types";

const resizeObserverOptions = {};

const maxWidth = 560;

export default function CampaignCarousel({
  campaigns,
}: {
  campaigns: AdminCampaigns["campaigns"];
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    <section ref={setContainerRef}>
      {campaigns ? (
        <div className="pt-12">
          <Swiper
            pagination={true}
            autoplay={true}
            modules={[Pagination, Autoplay]}
            width={
              containerWidth ? Math.min(containerWidth, maxWidth) : maxWidth
            }
            height={
              containerWidth
                ? (Math.min(containerWidth, maxWidth) * 9) / 16
                : (maxWidth * 9) / 16
            }>
            {campaigns?.map((campaign) =>
              isModalOpen ? (
                <CarouselModal
                  setIsModalOpen={setIsModalOpen}
                  campaign={campaign}
                  key={campaign.campaign_id}
                />
              ) : (
                <SwiperSlide key={campaign.campaign_id}>
                  <Image
                    src={campaign.campaign_image}
                    alt="campaign image"
                    width={
                      containerWidth
                        ? Math.min(containerWidth, maxWidth)
                        : maxWidth
                    }
                    height={
                      containerWidth
                        ? (Math.min(containerWidth, maxWidth) * 9) / 16
                        : (maxWidth * 9) / 16
                    }
                    className="mx-auto"
                    onClick={() => setIsModalOpen(true)}
                  />
                </SwiperSlide>
              )
            )}
          </Swiper>
        </div>
      ) : (
        ""
      )}
    </section>
  );
}
