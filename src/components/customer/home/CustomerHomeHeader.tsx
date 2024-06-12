"use client";
import logo from "@/src/public/LadderLogo.png";

import Image from "next/image";

export default function CustomerHomeHeader({
  brandLogo,
}: {
  brandLogo: Brand["brand_logo_url"];
}) {
  return (
    <div className="p-2 flex justify-around items-center gap-36 mb-8">
      <Image
        src={brandLogo.replace("ipfs://", "https://ipfs.io/ipfs/")}
        alt="brand logo"
        className="rounded-md cursor-pointer"
        width={60}
        height={60}
      />
      <Image src={logo} alt="Logo" loading="lazy" width={85} height={85} />
    </div>
  );
}
