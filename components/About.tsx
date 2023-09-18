import { useState } from "react";
import Image from "next/image";

import aboutBg from "../public/images/about-bg.png";
import styles from "../styles/Home.module.css";

type TextWithRectProps = {
  children: React.ReactNode;
  order: string;
};

const TextWithRect = ({ children, order }: TextWithRectProps) => {
  return (
    <div className={`${styles.textWithRect} ${styles[order]}`}>
      <p className="text-2xl text-center pt-6">{children}</p>
    </div>
  );
};

export default function About() {
  const [showAnimation, setShowAnimation] = useState(false);

  const handleShowAnimation = () => {
    setShowAnimation(true);
  };

  return (
    <section className="relative min-h-[53rem] w-full">
      <Image
        src={aboutBg}
        alt="bubbles"
        className="absolute top-0 left-0 w-full h-full opacity-10"
      />
      <h2 className="text-5xl text-center pt-12">ABOUT OUR PROJECT</h2>
      <div className="flex justify-center items-center pt-28">
        <div
          className="grid grid-cols-2 grid-rows-2"
          style={{ transform: "rotateZ(15deg)" }}>
          <TextWithRect order="first">
            Develop habits with the
            <br /> people you desire
          </TextWithRect>
          <TextWithRect order="second">
            You can level up and <br /> assign tasks as well
          </TextWithRect>
          <TextWithRect order="third">Track your own progress</TextWithRect>
          <TextWithRect order="fourth">
            Earn token and NFT by developing habits
          </TextWithRect>
        </div>
      </div>
    </section>
  );
}
