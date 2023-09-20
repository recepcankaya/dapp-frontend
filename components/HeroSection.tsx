import { useScroll, animated, useSpring } from "@react-spring/web";
import Image from "next/image";

import bubbleBg from "../public/images/hero-bubble-bg.png";

export default function HeroSection() {
  return (
    <header className="relative h-[847px]">
      <animated.div className="w-full h-full z-10 opacity-25">
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
      </animated.div>
      <h2 className="text-5xl font-holtwood absolute top-32 left-28">
        WHEN YOU LADDER IT
      </h2>
      <h2 className="text-5xl font-holtwood absolute right-28 bottom-72">
        YOU CAN GATHER IT
      </h2>
    </header>
  );
}
