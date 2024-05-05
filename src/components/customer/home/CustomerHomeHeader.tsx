"use client";
import Image from "next/image";
import logo from "@/src/public/LadderLogo.png";

export default function CustomerHomeHeader({
  brandLogo,
}: {
  brandLogo: Brand["brand_logo_ipfs_url"];
}) {
  return (
    <div className="p-2 flex justify-around items-center gap-36 mb-8">
      {/* @todo - DEFAULT PNG EKLENECEK */}
      <Image
        src={
          brandLogo
            ? brandLogo.replace("ipfs://", "https://ipfs.io/ipfs/")
            : "/default.png"
        }
        alt="brand logo"
        className="rounded-md cursor-pointer"
        width={60}
        height={60}
      />
      <Image src={logo} alt="Logo" loading="lazy" width={85} height={85} />
    </div>
  );
}
