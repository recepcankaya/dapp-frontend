"use client";

import QRCode from "react-qr-code";

export default function QrCodeClient({ value }: { value: string }) {
  return (
    <QRCode
      value={value}
      size={256}
      className="p-4 bg-white rounded-xl border-4 border-lad-purple"
    />
  );
}
