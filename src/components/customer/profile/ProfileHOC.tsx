"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";

import { createClient } from "@/src/lib/supabase/client";
import { logout } from "@/src/lib/logout";
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
    <div className="w-full text-black relative">
      <div
        className="flex items-center gap-2 absolute right-6 mt-8 cursor-pointer"
        onClick={logout}>
        <SignOutIcon />
        <p className="text-sm hover:underline hover:underline-offset-2">
          Çıkış Yap
        </p>
      </div>
      <h1 className="text-xl text-black text-center font-bold mt-20">
        {username}
      </h1>
      <div className="flex justify-around pt-16">
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

function SignOutIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="11"
      height="19"
      viewBox="0 0 11 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8.39231 10.6875H3.4375V8.3125H8.3435L7.59688 7.02287L8.569 5.34375L11 9.54275L8.569 13.7406L7.59688 12.0614L8.39231 10.6875ZM6.875 4.75H5.5V2.375H1.375V16.625H5.5V14.25H6.875V19H0V0H6.875V4.75Z"
        fill="black"
        fillOpacity="0.7"
      />
      <path
        d="M8.39231 10.6875H3.4375V8.3125H8.3435L7.59688 7.02287L8.569 5.34375L11 9.54275L8.569 13.7406L7.59688 12.0614L8.39231 10.6875ZM6.875 4.75H5.5V2.375H1.375V16.625H5.5V14.25H6.875V19H0V0H6.875V4.75Z"
        stroke="black"
      />
    </svg>
  );
}
