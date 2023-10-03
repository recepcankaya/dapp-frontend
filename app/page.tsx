"use client";
import { NextPage } from "next";

import NavBar from "@/components/NavBar";
import HeroSection from "@/components/HeroSection";
import About from "@/components/About";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";

const Home: NextPage = () => {
  return (
    <>
      <NavBar />
      <HeroSection />
      <main>
        <About />
        <HowItWorks />
      </main>
      <footer>
        <Footer />
      </footer>
    </>
  );
};

export default Home;
