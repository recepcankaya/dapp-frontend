"use client";
import { NextPage } from "next";

import NavBar from "../components/NavBar";
import HeroSection from "../components/HeroSection";
import About from "../components/About";
import HowItWorks from "../components/HowItWorks";

const Home: NextPage = () => {
  return (
    <>
      <NavBar />
      <HeroSection />
      <main>
        <About />
        <HowItWorks />
      </main>
    </>
  );
};

export default Home;
