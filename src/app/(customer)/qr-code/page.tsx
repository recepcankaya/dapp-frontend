"use client";

import useUserStore from "@/src/store/userStore";
import { useAddress } from "@thirdweb-dev/react";
import QRCode from "react-qr-code";

export default function QrCode() {
  const userID = useUserStore((state) => state.user.id);
  const customerAddress = useAddress();
  const qrCodeValue = {
    userID,
    forNFT: false,
    address: customerAddress,
  };
  return (
    <div className=" w-screen h-screen flex justify-center items-center">
      <QRCode
        value={JSON.stringify(qrCodeValue)}
        size={256}
        className="p-4 bg-white rounded-xl border-4 border-lad-purple"
      />
    </div>
  );
}
