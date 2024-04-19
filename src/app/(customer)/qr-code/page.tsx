"use client";

import useUserStore from "@/src/store/userStore";
import { useAddress } from "@thirdweb-dev/react";
import QRCode from "react-qr-code";

export default function QrCode() {
  const customerAddress = useAddress();
  const userId = useUserStore((state) => state.user?.id);

  const qrCodeValue = {
    userID: userId,
    forNFT: false,
    address: customerAddress,
  };
  return (
    <div className=" w-screen h-screen flex justify-center items-center bg-lad-white">
      <QRCode
        value={JSON.stringify(qrCodeValue)}
        size={256}
        className="p-4 bg-white rounded-xl border-4 border-lad-purple"
      />
    </div>
  );
}
