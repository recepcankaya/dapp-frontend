"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import QRCode from "react-qr-code";

import { createClient } from "../lib/supabase/client";
import { getShortLengthToastOptions } from "../lib/toastOptions";

export default function QrCodeClient({ userID }: { userID: User["id"] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const brandBranchID = searchParams.get("branchID");

  const qrCodeValue = {
    userID: userID,
    brandBranchID: brandBranchID,
    forNFT: false,
  };

  useEffect(() => {
    const getUsername = async () => {
      const supabase = createClient();
      const { data: user } = await supabase
        .from("users")
        .select("id, username")
        .eq("id", userID)
        .single();
      if (user?.id && !user?.username) {
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
    <QRCode
      value={JSON.stringify(qrCodeValue)}
      size={256}
      className="p-4 bg-white rounded-xl border-4 border-lad-purple"
    />
  );
}
