"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/navigation";
import "swiper/css";
import "swiper/css/pagination";

import { Pagination, Autoplay } from "swiper/modules";
import Image from "next/image";
import { useState } from "react";
import CarouselModal from "./CarouselModal";

export default function CampaignCarousel({ campaigns }: { campaigns: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <section className="w-full pt-12">
      <Swiper
        pagination={true}
        autoplay={true}
        modules={[Pagination, Autoplay]}>
        {campaigns.map((campaign) =>
          isModalOpen ? (
            <CarouselModal
              setIsModalOpen={setIsModalOpen}
              campaign={campaign}
              key={campaign.campaign_id}
            />
          ) : (
            <SwiperSlide key={campaign.campaign_id}>
              <Image
                src={campaign.campaign_image.replace(
                  "ipfs://",
                  "https://ipfs.io/ipfs/"
                )}
                alt="campaign image"
                width={500}
                height={500}
                onClick={() => setIsModalOpen(true)}
              />
            </SwiperSlide>
          )
        )}
      </Swiper>
    </section>
  );
}