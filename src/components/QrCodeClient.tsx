"use client";
import { useSearchParams } from "next/navigation";
import QRCode from "react-qr-code";

export default function QrCodeClient({ userID }: { userID: User["id"] }) {
  const searchParams = useSearchParams();
  const brandBranchID = searchParams.get("branchID");

  const qrCodeValue = {
    userID: userID,
    brandBranchID: brandBranchID,
    forNFT: false,
  };

  return (
    <QRCode
      value={JSON.stringify(qrCodeValue)}
      size={256}
      className="p-4 bg-white rounded-xl border-4 border-lad-purple"
    />
  );
}
