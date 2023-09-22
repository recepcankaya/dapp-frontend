import { useInView } from "react-intersection-observer";
import Image from "next/image";

import bubbleBg from "../public/images/hero-bubble-bg.png";

export default function HeroSection() {
  const { ref: firstH2Ref, inView: isFirstH2Visible } = useInView();
  const { ref: secondH2Ref, inView: isSecondH2Visible } = useInView();

  return (
    <header className="relative h-[847px]">
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
        ref={firstH2Ref}
        className={`${
          isFirstH2Visible
            ? "text-5xl font-holtwood absolute top-32 left-28 animate-visibleHeroH2"
            : "text-5xl font-holtwood absolute top-32 left-28 opacity-0"
        }`}>
        WHEN YOU LADDER IT
      </h2>
      <h2
        ref={secondH2Ref}
        className={`${
          isSecondH2Visible
            ? "text-5xl font-holtwood absolute right-28 bottom-72 animate-visibleHeroH2"
            : "text-5xl font-holtwood absolute right-28 bottom-72 opacity-0"
        }`}>
        YOU CAN GATHER IT
      </h2>
    </header>
  );
}
