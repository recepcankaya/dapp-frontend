"use client";
import { NextPage } from "next";

import NavBar from "@/components/landingpage/NavBar";
import HeroSection from "@/components/landingpage/HeroSection";
import About from "@/components/landingpage/About";
import Space from "@/components/landingpage/Space";

const Home: NextPage = () => {
  return (
    <>
      <NavBar />
      <div className="w-full h-0.5 bg-[#1E1E1E]"></div>
      <HeroSection />
      <main>
        <About />
        <Space />
      </main>
      <footer>
        {/* <Footer /> */}

      </footer>
    </>
  );
};

export default Home;
