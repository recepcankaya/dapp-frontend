import { useInView } from "react-intersection-observer";
import Image from "next/image";

import aboutBg from "../public/images/about-bg.png";
import styles from "../styles/About.module.css";

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
    <div
      className={`${
        isCompVisible ? `${styles.textWithRect} ${styles[order]}` : ""
      } `}>
      <p className="text-2xl text-center pt-6">{children}</p>
    </div>
  );
};

export default function About() {
  const { ref: scrollRef, inView: isCompVisible } = useInView();

  return (
    <section ref={scrollRef} className="relative min-h-[53rem] w-full">
      <Image
        src={aboutBg}
        alt="bubbles"
        className="absolute top-0 left-0 w-full h-full opacity-10"
      />
      <h2 className="text-5xl text-center pt-12">ABOUT OUR PROJECT</h2>
      <div className="flex justify-center items-center pt-28 overflow-hidden">
        <div
          className="grid grid-cols-2 grid-rows-2 gap-8"
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
