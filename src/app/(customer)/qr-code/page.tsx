"use client";
import QRCode from "react-qr-code";

export default function QrCode() {
  return (
    <div className=" w-screen h-screen flex justify-center items-center bg-lad-white">
      <QRCode
        value={JSON.stringify({ forNFT: false })}
        size={256}
        className="p-4 bg-white rounded-xl border-4 border-lad-purple"
      />
    </div>
  );
}
