"use client";
import useUserStore from "@/src/store/userStore";
import QRCode from "react-qr-code";

export default function QrCode() {
  const userID = useUserStore((state) => state.user.id);
  return (
    <div className=" w-screen h-screen flex justify-center items-center bg-lad-white">
      <QRCode
        value={JSON.stringify({ forNFT: false, userID: userID })}
        size={256}
        className="p-4 bg-white rounded-xl border-4 border-lad-purple"
      />
    </div>
  );
}
