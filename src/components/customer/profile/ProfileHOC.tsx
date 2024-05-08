"use client";
import { useState } from "react";

import RenderFreeRights from "./RenderFreeRights";
import RenderCustomerNFTs from "./RenderCustomerNFTs";
import QrCodeModal from "@/src/components/QrCodeModal";
import { useSearchParams } from "next/navigation";

type ProfileHOCProps = {
  userID: User["id"];
  userTotalFreeRights: UserOrders["user_total_free_rights"] | undefined;
  freeRightImageUrl: Brand["free_right_image_url"] | undefined;
};

export default function ProfileHOC({
  userID,
  userTotalFreeRights,
  freeRightImageUrl,
}: ProfileHOCProps) {
  const [qrCodeModalVisible, setQrCodeModalVisible] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<"Waiting" | "Your Collection">(
    "Waiting"
  );
  const searchParams = useSearchParams();
  const branchID = searchParams.get("branchID");

  return (
    <div className="w-full">
      <div className="flex justify-around">
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
      </div>
      <div>
        <RenderFreeRights
          userID={userID}
          selectedTab={selectedTab}
          userTotalFreeRights={userTotalFreeRights}
          freeRightImageUrl={freeRightImageUrl}
          setQrCodeModalVisible={setQrCodeModalVisible}
        />
        <RenderCustomerNFTs selectedTab={selectedTab} />
      </div>
      <QrCodeModal
        isVisible={qrCodeModalVisible}
        value={JSON.stringify({
          forNFT: true,
          userID: userID,
          brandBranchID: branchID,
        })}
        onClose={() => setQrCodeModalVisible(false)}
      />
    </div>
  );
}
