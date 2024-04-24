"use client";
import { useState } from "react";

import RenderFreeRights from "./RenderFreeRights";
import RenderCustomerNFTs from "./RenderCustomerNFTs";
import QrCodeModal from "@/src/components/QrCodeModal";

type ProfileHOCProps = {
  userID: string | undefined;
  numberOfFreeRights: any;
  freeRightImageUrl: any;
};

export default function ProfileHOC({
  userID,
  numberOfFreeRights,
  freeRightImageUrl,
}: ProfileHOCProps) {
  const [qrCodeModalVisible, setQrCodeModalVisible] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<"Waiting" | "Your Collection">(
    "Waiting"
  );

  return (
    <div className="flex justify-around w-full">
      <button
        onClick={() => setSelectedTab("Waiting")}
        className={`py-2 ${
          selectedTab === "Waiting" ? "border-b-2 border-white" : ""
        }`}>
        Bekleyenler
      </button>
      <button
        onClick={() => setSelectedTab("Your Collection")}
        className={`py-2 ${
          selectedTab === "Your Collection" ? "border-b-2 border-white" : ""
        }`}>
        Koleksiyonunuz
      </button>
      <RenderFreeRights
        selectedTab={selectedTab}
        numberOfFreeRights={numberOfFreeRights}
        freeRightImageUrl={freeRightImageUrl}
        setQrCodeModalVisible={setQrCodeModalVisible}
      />
      <RenderCustomerNFTs selectedTab={selectedTab} />
      <QrCodeModal
        isVisible={qrCodeModalVisible}
        value={JSON.stringify({ forNFT: true, userID: userID })}
        onClose={() => setQrCodeModalVisible(false)}
      />
    </div>
  );
}
