import Image from "next/image";
import styles from "@/styles/HeroSection.module.css";
import { motion } from "framer-motion";

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
    <header className="relative h-auto gap-16 lg:block">
      <div className="font-rubikGlitch ">
        <h2 className="text-[95px] text-[#1E1E1E]">When You</h2>
        <h2 className={styles.compImg}>Ladder It</h2>
        <h2 className="text-[95px] text-[#1E1E1E] text-right">You Gather It</h2>
      </div>
      <div className="flex items-center">
        <Image
          src="/images/hero-image.svg"
          alt="hero-image"
          width={200}
          height={200}
        />
        <p className="font-normal text-center text-[25px]">
          Start the transformation with your habits. We offer an extraordinary
          way to connect with people. <br />
          Are you ready to explore?
        </p>
      </div>
      {/* <motion.h2
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
      </motion.h2> */}
    </header>
  );
}
