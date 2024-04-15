"use client";
import Image from "next/image";
import logo from "@/src/public/LadderLogo.png";

import useAdminStore from "@/src/store/adminStore";

export default function CustomerHomeHeader() {
  const brandLogo = useAdminStore((state) => state.admin.brandLogo);

  return (
    <div className="p-2 flex justify-around items-center gap-36">
      <Image
        loading="lazy"
        src={brandLogo.replace("ipfs://", "https://ipfs.io/ipfs/")}
        alt="brand logo"
        width={70}
        height={70}
        className="rounded-2xl cursor-pointer"
      />
      <Image src={logo} alt="Logo" width={80} height={80} />
    </div>
  );
}
