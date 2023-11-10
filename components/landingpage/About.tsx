import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import Image from "next/image";

import aboutBg from "@/public/images/about-bg.png";
import styles from "@/styles/About.module.css";

type TextWithRectProps = {
  children: React.ReactNode;
  order: string;
  isCompVisible: boolean;
};

const TextWithRect = ({
  children,
  order,
  isCompVisible,
}: TextWithRectProps) => {
  return (
    <motion.div
      className={`${
        isCompVisible ? `${styles.textWithRect} ${styles[order]}` : ""
      }`}
      drag
      dragConstraints={{
        top: 125,
        left: -125,
        right: 125,
        bottom: -125,
      }}
      dragElastic={0.2}>
      <p className="text-center text-xs md:text-lg lg:text-2xl 2xl:text-5xl lg:pt-6 2xl:pt-10">
        {children}
      </p>
    </motion.div>
  );
};

export default function About() {
  const { ref: scrollRef, inView: isCompVisible } = useInView();

  return (
    <section
      ref={scrollRef}
      className="relative lg:min-h-[50rem] 2xl:min-h-[75rem] w-full pb-8 sm:pb-20 2xl:pb-24 text-foreground bg-background">
      <h2 className="text-2xl md:text-4xl lg:text-5xl 2xl:text-8xl text-center font-semibold pt-12 italic">
        ABOUT OUR PROJECT
      </h2>
      <div className="flex justify-center items-center pt-10 md:pt-24 lg:pt-28 2xl:pt-44">
        <div
          className="md:grid md:grid-cols-2 md:grid-rows-2 md:gap-8 xl:gap-16 2xl:gap-32"
          style={{ transform: "rotateZ(15deg)" }}>
          <TextWithRect order="first" isCompVisible={isCompVisible}>
            Develop habits with the
            <br /> people you desire
          </TextWithRect>
          <TextWithRect order="second" isCompVisible={isCompVisible}>
            You can level up and <br /> assign tasks as well
          </TextWithRect>
          <TextWithRect order="third" isCompVisible={isCompVisible}>
            Track your own progress
          </TextWithRect>
          <TextWithRect order="fourth" isCompVisible={isCompVisible}>
            Earn token and NFT by developing habits
          </TextWithRect>
        </div>
      </div>
    </section>
  );
}
