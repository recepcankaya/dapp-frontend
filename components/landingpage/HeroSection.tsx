import Image from "next/image";
import { motion } from "framer-motion";

import bubbleBg from "@/public/images/hero-bg.png";

const firstHeadingVariants = {
  hidden: {
    opacity: 0,
    y: -100,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
      delay: 0.25,
      ease: "easeInOut",
    },
  },
};

const secondHeadingVariants = {
  hidden: {
    opacity: 0,
    y: 100,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
      delay: 0.5,
      ease: "easeInOut",
    },
  },
};

export default function HeroSection() {
  return (
    <header className="relative h-[400px] lg:h-[30rem] 2xl:h-[60rem] font-bold flex flex-col justify-center items-center gap-16 lg:block bg-background text-foreground">
      <motion.h2
        className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-8xl font-holtwood text-center lg:absolute lg:top-24 lg:left-28 2xl:left-36 2xl:top-48"
        variants={firstHeadingVariants}
        initial="hidden"
        whileInView="visible">
        WHEN YOU LADDER IT
      </motion.h2>
      <motion.h2
        className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-8xl font-holtwood text-center lg:absolute lg:right-28 lg:top-60 2xl:right-36 2xl:top-[40rem]"
        variants={secondHeadingVariants}
        initial="hidden"
        whileInView="visible">
        YOU CAN GATHER IT
      </motion.h2>
    </header>
  );
}
