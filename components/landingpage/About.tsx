import { useInView } from "react-intersection-observer";
import Image from "next/image";


export default function About() {
  const { ref: scrollRef, inView: isCompVisible } = useInView();

  return (
    <section
      ref={scrollRef}
      className="bg-black relative h-[100rem]"
    >
      <div className="absolute top-0 left-0 h-auto w-auto rounded-lg bg-gradient-to-br from-[#4035CB] to-[#B80DCA] pt-1 pb-1 pr-1">
        <div className="h-full w-full bg-[#343434] pt-40 px-12 pb-40">
          <h2 className="text-6xl text-center">Make a Habit</h2>
          <p className="text-3xl mt-24 text-center">Choose your desired <br /> interest. Create your habit and <br /> learn from it</p>
        </div>
      </div>
      <div className="h-[45rem] w-1 bg-[#B80DCA] absolute top-0 right-[40rem]"></div>
      <div className="absolute top-0 right-0 h-auto w-auto rounded-lg bg-gradient-to-br from-[#4035CB] to-[#B80DCA] pt-1 pb-1 pl-1">
        <div className="h-full w-full bg-[#343434] pt-40 px-12 pb-40">
          <h2 className="text-6xl text-center">Make a Habit</h2>
          <p className="text-3xl mt-24 text-center">Choose your desired <br /> interest. Create your habit and <br /> learn from it</p>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 h-auto w-auto rounded-lg bg-gradient-to-br from-[#4035CB] to-[#B80DCA] pt-1 pb-1 pr-1">
        <div className="h-full w-full bg-[#343434] pt-40 px-12 pb-40">
          <h2 className="text-6xl text-center">Make a Habit</h2>
          <p className="text-3xl mt-24 text-center">Choose your desired <br /> interest. Create your habit and <br /> learn from it</p>
        </div>
      </div>
      <div className="w-[45rem] h-1 bg-[#4035CB] absolute left-0 bottom-[43rem]"></div>
      <div className="absolute bottom-0 right-0 h-auto w-auto rounded-lg bg-gradient-to-br from-[#4035CB] to-[#B80DCA] pt-1 pb-1 pl-1">
        <div className="h-full w-full bg-[#343434] pt-40 px-12 pb-40">
          <h2 className="text-6xl text-center">Connect with Others</h2>
          <p className="text-3xl mt-24 text-center">Find people with similar <br /> interests to you</p>
        </div>
      </div>
    </section>
  );
}
