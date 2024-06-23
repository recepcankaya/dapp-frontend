"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";

import { createClient } from "@/src/lib/supabase/client";
import RenderFreeRights from "./RenderFreeRights";
import RenderCustomerNFTs from "./RenderCustomerNFTs";
import QrCodeModal from "@/src/components/QrCodeModal";
import { getShortLengthToastOptions } from "@/src/lib/toastOptions";

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
  const [username, setUsername] = useState<User["username"]>();
  const [qrCodeModalVisible, setQrCodeModalVisible] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<"Waiting" | "Your Collection">(
    "Waiting"
  );
  const router = useRouter();
  const searchParams = useSearchParams();
  const branchID = searchParams.get("branchID");

  useEffect(() => {
    const getUsername = async () => {
      const supabase = createClient();
      const { data: user } = await supabase
        .from("users")
        .select("id, username")
        .eq("id", userID)
        .single();
      if (user?.username) {
        setUsername(user.username);
      } else if (user?.id && !user?.username) {
        toast.info(
          "Kullanıcı adı bulunamadığı için yeni bir sayfaya yönlendiriliyorsunuz.",
          getShortLengthToastOptions()
        );
        router.replace("/user/user-info");
      }
    };

    getUsername();
  }, [userID, router]);

  return (
    <div className="w-full text-black">
      <h1 className="text-xl mb-16 text-black text-center font-bold">
        {username}
      </h1>
      <div className="flex justify-around">
        <button
          onClick={() => setSelectedTab("Waiting")}
          className={`py-2 ${
            selectedTab === "Waiting" ? "border-b-2 border-black" : ""
          }`}>
          Bekleyenler
        </button>
        <button
          onClick={() => setSelectedTab("Your Collection")}
          className={`py-2 ${
            selectedTab === "Your Collection" ? "border-b-2 border-black" : ""
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
