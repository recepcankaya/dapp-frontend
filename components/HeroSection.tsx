import { useInView } from "react-intersection-observer";
import Image from "next/image";

import bubbleBg from "../public/images/hero-bg.png";

export default function HeroSection() {
  const { ref: firstH2Ref, inView: isFirstH2Visible } = useInView();
  const { ref: secondH2Ref, inView: isSecondH2Visible } = useInView();

  return (
    <header
      ref={firstH2Ref}
      className="relative h-[400px] lg:h-[847px] font-bold">
      <Image
        src={bubbleBg}
        alt="bubbles"
        className="absolute top-0 left-0 w-full h-full opacity-10 object-cover"
      />
      <h2
        className={`${
          isFirstH2Visible
            ? "text-2xl sm:text-4xl lg:text-5xl font-holtwood text-center pt-12 lg:absolute lg:top-32 lg:left-28 animate-visibleHeroH2"
            : "text-2xl sm:text-4xl lg:text-5xl font-holtwood text-center pt-12 lg:absolute lg:top-32 lg:left-28 opacity-0"
        }`}>
        WHEN YOU LADDER IT
      </h2>
      <h2
        ref={secondH2Ref}
        className={`${
          isSecondH2Visible
            ? "text-2xl sm:text-4xl lg:text-5xl font-holtwood text-center pt-48 lg:absolute lg:right-28 lg:bottom-72 animate-visibleHeroH2"
            : "text-2xl sm:text-4xl lg:text-5xl font-holtwood text-center pt-48 lg:absolute lg:right-28 lg:bottom-72 opacity-0"
        }`}>
        YOU CAN GATHER IT
      </h2>
    </header>
  );
}
