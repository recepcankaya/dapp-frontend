import Image from "next/image";

export default function HeroSection() {
  return (
    <header className="h-auto gap-16 lg:block">
      <div className="font-rubikGlitch ">
        <h2 className="text-[125px] text-[#343434] -mb-12">When You</h2>
        <h2 className="text-[150px] text-center -mb-12">Ladder It</h2>
        <h2 className="text-[125px] text-[#343434] text-right mt-2">You Gather It</h2>
      </div>
      <div className="flex items-center">
        <Image
          src="/images/hero-image.svg"
          alt="hero-image"
          width={220}
          height={220}
          className="animate-moveUpDown"
        />
        <p className="font-normal mx-auto text-center text-3xl">
          Start the transformation with your habits. We offer an extraordinary
          way to connect with people. <br />
          Are you ready to explore?
        </p>
      </div>

    </header>
  );
}
