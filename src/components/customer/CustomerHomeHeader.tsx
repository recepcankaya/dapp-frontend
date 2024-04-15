"use client";
import Image from "next/image";
import logo from "@/src/public/LadderLogo.png";

import useAdminStore from "@/src/store/adminStore";

export default function CustomerHomeHeader() {
  const brandLogo = useAdminStore((state) => state.admin.brandLogo);

  return (
    <div className="p-2 flex justify-around items-center gap-36 mb-8">
      <div className="relative w-16 h-16">
        <Image
          src={brandLogo.replace("ipfs://", "https://ipfs.io/ipfs/")}
          alt="brand logo"
          className="rounded-md cursor-pointer"
          priority
          fill
          sizes="10vw" />
      </div>
      <div className="relative w-24 h-24">
        <Image src={logo} alt="Logo" loading="lazy" fill sizes="10vw" />
      </div>
    </div>
  );
}
