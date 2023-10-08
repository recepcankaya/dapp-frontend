import { useInView } from "react-intersection-observer";
import Image from "next/image";

import bubbleBg from "../public/images/hero-bg.png";

export default function HeroSection() {
  const { ref: secondH2Ref, inView: isSecondH2Visible } = useInView();

  return (
    // @todo - 2 partlı animasyonu tek parta değiştir
    <header className="relative h-[400px] lg:h-[847px] 2xl:h-[85rem] font-bold">
      <Image
        src={bubbleBg}
        alt="bubbles"
        className="absolute top-0 left-0 w-full h-full opacity-10 object-cover"
      />
      <h2 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-7xl font-holtwood text-center pt-12 lg:absolute lg:top-32 lg:left-28 animate-visibleHeroH2">
        WHEN YOU LADDER IT
      </h2>
      <h2
        ref={secondH2Ref}
        className={`${
          isSecondH2Visible
            ? "text-2xl sm:text-4xl lg:text-5xl 2xl:text-7xl font-holtwood text-center pt-48 lg:absolute lg:right-28 lg:bottom-72 animate-visibleHeroH2"
            : "text-2xl sm:text-4xl lg:text-5xl font-holtwood text-center pt-48 lg:absolute lg:right-28 lg:bottom-72 opacity-0"
        }`}>
        YOU CAN GATHER IT
      </h2>
    </header>
  );
}
