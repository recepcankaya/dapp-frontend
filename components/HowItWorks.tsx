import Image from "next/image";

import LandingPageSVGs from "./LandingPageSVGs";
import iconLogout from "../public/icons/icon-logout.svg";
import iconProfileCircle from "../public/icons/icon-profile-circle.svg";
import iconUser from "../public/icons/icon-user.svg";
import userImages from "../public/images/user-images.png";

const SIZE_OF_DIVS =
  "h-44 w-32 sm:h-60 sm:w-40 md:h-80 md:w-48 lg:h-96 lg:w-60 2xl:h-1/4 2xl:w-1/6";

const FirstImageFromApp = () => {
  return (
    <div
      className={`${SIZE_OF_DIVS} absolute left-6 top-6 sm:top-24 lg:top-40 2xl:left-12 2xl:top-52 rounded-3xl bg-black`}>
      <div className="h-1/4 w-full bg-btnNotifyColor rounded-t-3xl flex justify-around items-center">
        <Image
          src={iconLogout}
          alt="logout"
          className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 2xl:w-12 2xl:h-12"
        />
        <p className="font-bold">profile</p>
        <Image
          src={iconProfileCircle}
          alt="profile"
          className="w-4 h-4 sm:w-6 sm:h-6 lg:h-8 lg:w-8 2xl:w-12 2xl:h-12"
        />
      </div>
      <div className="mt-2 2xl:mt-6 w-11/12 h-4 m-auto flex flex-col items-center">
        <Image
          src={iconUser}
          alt="icon user"
          className="w-6 h-6 sm:h-10 sm:w-10 md:w-12 md:h-12 lg:h-14 lg:w-14 2xl:h-24 2xl:w-24 md:mt-2 md:mb-2 2xl:mb-6"
        />
        <input
          type="text"
          placeholder="Log in"
          className="w-full 2xl:py-4 2xl:mb-4 mt-2 bg-gray-400 rounded-full placeholder:text-black placeholder:font-semibold placeholder:text-center placeholder:italic"
          disabled
        />
        <p className="italic 2xl:mb-4">or</p>
        <input
          type="text"
          placeholder="Sign up"
          className="w-full 2xl:py-4 mt-2 bg-gray-400 rounded-full placeholder:text-black placeholder:font-semibold placeholder:text-center placeholder:italic"
          disabled
        />
      </div>
    </div>
  );
};

const SecondImageFromApp = () => {
  return (
    <div
      className={`${SIZE_OF_DIVS} absolute right-4 top-2 2xl:right-12 rounded-3xl bg-white`}>
      <div className="h-1/4 w-full bg-btnNotifyColor rounded-t-3xl pt-1 sm:pt-2 lg:pl-2 2xl:pt-8 2xl:pl-6">
        <Image
          src={iconProfileCircle}
          alt="profile"
          className="w-4 h-4 md:w-6 md:h-6 lg:w-8 lg:h-8 2xl:w-12 2xl:h-12 ml-4"
        />
        <p className=" italic font-bold pl-4 sm:pt-1 md:pt-1.5 lg:pt-2 2xl:pt-6">
          Hey, Sam
        </p>
      </div>
      <div className="mt-2 lg:mt-4 2xl:mt-8 flex flex-col items-center justify-center">
        <p className="text-black font-bold italic px-1 2xl:px-4 ml-2">
          What you need is right here!
        </p>
        <input
          type="text"
          placeholder="Search your interest"
          className="w-11/12 mt-2 md:mt-4 2xl:mt-8 lg:mt-6 2xl:py-4 bg-gray-400 rounded-full placeholder:text-gray-700 placeholder:pl-2 placeholder:italic"
          disabled
        />
      </div>
    </div>
  );
};

const ThirdImageFromApp = () => {
  return (
    <div
      className={`${SIZE_OF_DIVS} absolute right-4 2xl:right-12 bottom-4 sm:bottom-20 lg:bottom-32 rounded-3xl bg-black`}>
      <div className="h-1/4 w-full flex items-center bg-btnNotifyColor rounded-t-3xl pt-1 pl-1 sm:pl-2 md:pl-3 2xl:pl-5">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="28"
          viewBox="0 0 16 28"
          fill="none"
          className="h-3 w-3 md:h-3.5 md:w-3.5 2xl:h-6 2xl:w-6">
          <path
            d="M13 25.3176L3.81366 16.1314C2.72878 15.0465 2.72878 13.2712 3.81366 12.1863L13 3"
            stroke="#B5AEE4"
            strokeWidth="5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <p className="italic font-bold pl-2 md:pl-3">Your progress</p>
      </div>
      <div className="mt-2 2xl:mt-6 flex flex-col items-center justify-center">
        <div className="w-11/12 h-4 2xl:h-6 bg-slate-300 rounded-full relative before:absolute before:top-0 before:left-0 before:w-1/2 before:h-full before:rounded-full before:bg-[#A9A1DC]"></div>
      </div>
      <svg
        width="309"
        height="248"
        viewBox="0 0 309 248"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-40 lg:h-40 2xl:h-72 2xl:w-72 m-auto mt-2 sm:mt-4 2xl:mt-8">
        <line
          x1="5.5"
          y1="232.027"
          x2="5.5"
          y2="0.973236"
          stroke="white"
          strokeWidth="10"
        />
        <line
          x1="308.121"
          y1="243"
          x2="10.8788"
          y2="243"
          stroke="white"
          strokeWidth="10"
        />
        <line
          x1="45.0559"
          y1="191.107"
          x2="99.0559"
          y2="107.107"
          stroke="white"
          strokeWidth="7"
        />
        <line
          x1="99.5071"
          y1="104.558"
          x2="169.188"
          y2="176.087"
          stroke="white"
          strokeWidth="7"
        />
        <path
          d="M263.44 46.3541C263.083 44.4543 261.254 43.2034 259.354 43.5601L228.395 49.3734C226.495 49.7301 225.244 51.5594 225.601 53.4592C225.958 55.359 227.787 56.6099 229.687 56.2531L257.206 51.0858L262.373 78.6049C262.73 80.5047 264.559 81.7556 266.459 81.3988C268.359 81.0421 269.61 79.2128 269.253 77.313L263.44 46.3541ZM169.889 184.976L262.889 48.9756L257.111 45.0244L164.111 181.024L169.889 184.976Z"
          fill="white"
        />
      </svg>
    </div>
  );
};

const FourthImageFromApp = () => {
  return (
    <div
      className={`${SIZE_OF_DIVS} absolute left-6 2xl:left-12 bottom-0 sm:bottom-4 rounded-3xl bg-white mt-12 overflow-hidden`}>
      <div className="h-1/4 w-full flex items-center bg-btnNotifyColor rounded-t-3xl pt-1 pl-2 2xl:pl-6">
        <svg
          width="16"
          height="28"
          viewBox="0 0 16 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-3 w-3 2xl:w-7 2xl:h-7">
          <path
            d="M3 25.3178L12.1863 16.1315C13.2712 15.0466 13.2712 13.2713 12.1863 12.1864L3 3"
            stroke="#ADA5DF"
            strokeWidth="5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <p className="italic font-bold leading-none pl-2 2xl:pl-5">
          Contact to other people
        </p>
      </div>
      <div className="mt-2 md:mt-6 mx-auto w-11/12 h-28 sm:h-32 md:h-40 lg:h-48 2xl:h-[70%] flex justify-center">
        <Image
          src={userImages}
          alt="user images"
          className="pt-2.5 object-cover w-auto h-auto"
        />
      </div>
    </div>
  );
};

export default function HowItWorks() {
  return (
    <section className="bg-background h-auto pb-8">
      <h2 className="text-2xl md:text-4xl lg:text-5xl 2xl:text-8xl font-semibold text-center py-4 md:py-8 lg:py-12">
        How It Works
      </h2>
      <div className="relative w-full text-sm sm:text-base md:text-lg lg:text-2xl 2xl:text-4xl">
        <LandingPageSVGs />
        <FirstImageFromApp />
        <SecondImageFromApp />
        <ThirdImageFromApp />
        <FourthImageFromApp />
      </div>
    </section>
  );
}
