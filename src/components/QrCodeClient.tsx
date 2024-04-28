"use client";

import { useAddress } from "@thirdweb-dev/react";
import QRCode from "react-qr-code";

export default function QrCodeClient({
  userID,
}: {
  userID: string | undefined;
}) {
  const customerAddress = useAddress();

  const qrCodeValue = {
    userID: userID,
    adminID: "",
    forNFT: false,
    address: customerAddress,
  };

  return (
    <QRCode
      value={JSON.stringify(qrCodeValue)}
      size={256}
      className="p-4 bg-white rounded-xl border-4 border-lad-purple"
    />
  );
}
