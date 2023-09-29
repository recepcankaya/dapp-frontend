import { useInView } from "react-intersection-observer";
import Image from "next/image";

import bubbleBg from "../public/images/hero-bubble-bg.png";

export default function HeroSection() {
  const { ref: firstH2Ref, inView: isFirstH2Visible } = useInView();
  const { ref: secondH2Ref, inView: isSecondH2Visible } = useInView();

  // @todo - change the navbar the section height with responsive layout then adjust the positions of headings
  return (
    <header ref={firstH2Ref} className="relative h-[847px]">
      <div className="w-full h-full z-10 opacity-25">
        <div className="w-full h-full -z-10">
          <Image
            src={bubbleBg}
            alt="some bubbles"
            className="absolute top-12 left-24"
          />
          <Image
            src={bubbleBg}
            alt="some bubbles"
            className="absolute top-12 right-24 rotate-45"
          />
          <Image
            src={bubbleBg}
            alt="some bubbles"
            className="absolute bottom-12 left-24"
          />
          <Image
            src={bubbleBg}
            alt="some bubbles"
            className="absolute bottom-12 right-24 rotate-45"
          />
        </div>
      </div>
      <h2
        className={`${
          isFirstH2Visible
            ? "text-3xl sm:text-4xl lg:text-5xl font-holtwood absolute top-12 lg:top-32 lg:left-28 animate-visibleHeroH2"
            : "text-3xl sm:text-4xl lg:text-5xl font-holtwood absolute top-12 lg:top-32 lg:left-28 opacity-0"
        }`}>
        WHEN YOU LADDER IT
      </h2>
      <h2
        ref={secondH2Ref}
        className={`${
          isSecondH2Visible
            ? "text-3xl sm:text-4xl lg:text-5xl font-holtwood absolute bottom-48 lg:right-28 lg:bottom-72 animate-visibleHeroH2"
            : "text-3xl sm:text-4xl lg:text-5xl font-holtwood absolute bottom-48 lg:right-28 lg:bottom-72 opacity-0"
        }`}>
        YOU CAN GATHER IT
      </h2>
    </header>
  );
}
