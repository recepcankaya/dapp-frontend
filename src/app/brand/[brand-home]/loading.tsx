import React from "react";

export default function Loading() {
  return (
    <div className="flex justify-center items-center text-center relative min-h-screen bg-[#d8d0c3]">
      <div className="absolute w-[200px] h-[200px] rounded-[50%] before:absolute before:content-none before:left-0 before:top:0 before:w-full before:h-full before:rounded-[50%] before:shadow-[0_0_5px_rgba(0,0,0,0.3)] animate-loading"></div>
      <span className="text-lad-black">Yükleniyor...</span>
    </div>
  );
}
