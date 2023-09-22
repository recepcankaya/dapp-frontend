"use client";
import { NextPage } from "next";

import NavBar from "../components/NavBar";
import HeroSection from "../components/HeroSection";
import About from "../components/About";

const Home: NextPage = () => {
  return (
    <>
      <NavBar />
      <HeroSection />
      <main>
        <About />
      </main>
    </>
  );
};

export default Home;
