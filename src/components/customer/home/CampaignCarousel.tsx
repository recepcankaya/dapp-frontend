"use client";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

import CarouselModal from "./CarouselModal";
import useSwipe from "@/src/hooks/useSwipe";
/**
 * Renders a carousel component for displaying campaign images.
 *
 * @param campaigns The array of campaigns to be displayed in the carousel.
 */
export default function CampaignCarousel({
  campaigns,
}: {
  campaigns: Campaigns[] | null;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const { handleTouchStart, handleTouchEnd, swipeDirection } = useSwipe();

  /**
   * Functions to show the next(previous) image in the carousel.
   * If the modal is open, the function will return early and not perform any action.
   * If the current image index is at the last(first) image, it will wrap around and show the first(last) image.
   * Otherwise, it will increment(decrement) the image index by 1.
   */
  const showNextImage = useCallback(() => {
    if (isModalOpen) return;
    setImageIndex((index: number) => {
      if (index === (campaigns?.length ?? 0) - 1) return 0;
      return index + 1;
    });
  }, [campaigns, isModalOpen]);

  const showPreviousImage = useCallback(() => {
    if (isModalOpen) return;
    setImageIndex((index: number) => {
      return index === 0 ? (campaigns?.length ?? 0) - 1 : index - 1;
    });
  }, [campaigns, isModalOpen]);

  /**
   * Enable swiping functionality for the campaign carousel images unless a modal is open.
   *
   * @param swipeDirection The direction of the swipe action.
   * @param campaigns Brand's campaigns to be displayed in the carousel.
   * @param showNextImage Function to transition to the next image in the carousel.
   * @param showPreviousImage Function to transition to the previous image (only for swiping) in the carousel.
   */
  useEffect(() => {
    if (swipeDirection === "left") {
      showNextImage(); // Assuming left swipe goes to the next image
    } else if (swipeDirection === "right") {
      showPreviousImage(); // Assuming right swipe goes to the previous image
    }
  }, [swipeDirection, campaigns, showNextImage, showPreviousImage]);

  /**
   * Cycles through carousel images automatically unless a modal is open.
   *
   * Sets up an interval to call `showNextImage` every 2500 milliseconds to
   * automatically transition to the next image in the carousel. This automatic
   * cycling stops if `isModalOpen` is true.
   *
   * @param imageIndex The current index of the displayed image in the carousel.
   * @param isModalOpen Boolean indicating if a modal is currently open.
   * @param showNextImage Function to transition to the next image in the carousel.
   */
  useEffect(() => {
    if (isModalOpen) return;
    const interval = setInterval(() => {
      showNextImage();
    }, 2500);

    return () => clearInterval(interval);
  }, [imageIndex, isModalOpen, showNextImage]);

  /**
   * Manages page scrollability based on modal state.
   *
   * - Disables scrolling (`overflow: hidden`) when a modal is open (`isModalOpen: true`).
   * - Enables scrolling (resets `overflow`) when the modal is closed (`isModalOpen: false`).
   * - Ensures scrolling is always enabled when the component unmounts.
   *
   * @param isModalOpen Boolean indicating if the modal is open.
   */
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  if (!campaigns) return null;

  return (
    <div
      className="w-full h-full relative"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}>
      {isModalOpen && (
        <CarouselModal
          campaign={campaigns[imageIndex]}
          setIsModalOpen={setIsModalOpen}
        />
      )}
      <div className="w-full h-full flex overflow-hidden">
        {campaigns.map((camp) => (
          <Image
            key={camp.id}
            src={camp.image_url}
            alt={camp.name}
            width={0}
            height={0}
            sizes="100vw"
            className="block object-contain w-full h-full flex-shrink-0 flex-grow-0"
            style={{
              translate: `${imageIndex * -100}%`,
              transition: "translate 300ms ease-in-out",
            }}
            onClick={() => setIsModalOpen(true)}
          />
        ))}
      </div>
      <div
        style={{
          translate: "-50%",
        }}
        className="absolute bottom-2 left-1/2 flex gap-2">
        {campaigns.map((_, index) => (
          <div key={index} className="w-3 h-3">
            {index === imageIndex ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="blue"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-full w-full">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="1" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="blue"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-full w-full">
                <circle cx="12" cy="12" r="10" />
              </svg>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
