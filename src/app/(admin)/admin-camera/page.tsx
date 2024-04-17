"use client";

import { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";

import useAdminForAdminStore from "@/src/store/adminStoreForAdmin";
import { toast } from "@/src/components/ui/use-toast";
import { Toaster } from "@/src/components/ui/toaster";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { createClient } from "@supabase/supabase-js";

const AdminCamera = () => {
  const [qrOn, setQrOn] = useState<boolean>(true);
  const [scannedResult, setScannedResult] = useState<string | undefined>("");
  const supabase = createClientComponentClient();
  const secretSupabase = createClient(
    String(process.env.NEXT_PUBLIC_SUPABASE_URL),
    String(process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY)
  );

  const adminID = useAdminForAdminStore((state) => state.admin.adminId);
  const scanner = useRef<QrScanner>();
  const videoEl = useRef<HTMLVideoElement>(null);
  const qrBoxEl = useRef<HTMLDivElement>(null);

  const onScanSuccess = async (result: QrScanner.ScanResult) => {
    setScannedResult(result?.data);
    await handleScan();
  };

  const handleScan = async () => {
    if (!scannedResult) return;
    const { userID, forNFT, address } = JSON.parse(scannedResult);
    const { data: userMissionInfo } = await supabase
      .from("user_missions")
      .select(
        "number_of_orders, id, customer_number_of_orders_so_far, number_of_free_rights"
      )
      .eq("user_id", userID)
      .eq("admin_id", adminID);

    // get number_for_reward from admin table
    const { data: numberForReward } = await supabase
      .from("admins")
      .select("number_for_reward")
      .eq("id", adminID);

    const { data: username } = await secretSupabase
      .from("users")
      .select("username")
      .eq("id", userID)
      .single();

    if (forNFT === true && userMissionInfo) {
      const result = await fetch(
        "https://mint-nft-js.vercel.app/collectionNFT",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            admin_id: adminID,
            user_wallet: address,
          }),
        }
      );
      const { success } = await result.json();
      if (success === true) {
        // Decrement not_used_nfts from admins table and number_of_free_rights from user_missions table
        await supabase.rpc(
          "decrement_admins&user_missions_number_of_free_rigths",
          {
            id: adminID,
            mission_id: userMissionInfo[0].id,
          }
        );

        await supabase.rpc(
          "increment_admins&user_missions_number_of_ordes_so_far",
          {
            id: adminID,
            mission_id: userMissionInfo[0].id,
          }
        );

        toast({
          title: `${username} adlı müşteriniz ödülünüzü kullandı.`,
          description: `Bugüne kadar verilen sipariş sayısı: ${
            userMissionInfo[0].customer_number_of_orders_so_far + 1
          } ${"\n"} Kalan ödül hakkı: ${
            userMissionInfo[0].number_of_free_rights - 1
          }`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Müşteri ödülünü kullanamadı.",
          description: "Lütfen tekrar deneyiniz.",
        });
      }
    }
    // If the order is not for free, check the number of orders
    else {
      if (userMissionInfo?.length === 0) {
        // If the user does not have a record in the user_missions table, add a new record
        await supabase.from("user_missions").insert({
          number_of_orders: 1,
          user_id: userID,
          admin_id: adminID,
        });

        await supabase.rpc(
          "increment_admins&user_missions_number_of_ordes_so_far",
          {
            id: adminID,
            mission_id: userMissionInfo[0].id,
          }
        );

        toast({
          title: `${username?.username} adlı müşterinizin işlemi başarıyla gerçekleştirildi.`,
          description: `İlk sipariş!`,
        });
      } else if (
        numberForReward &&
        userMissionInfo &&
        userMissionInfo[0].number_of_orders <
          numberForReward[0].number_for_reward - 1
      ) {
        // If the user has a record in the user_missions table and the number of orders is less than the number_for_reward, increase the number of orders by one
        await supabase.rpc("increment_user_missions_number_of_orders", {
          mission_id: userMissionInfo[0].id,
        });

        await supabase.rpc(
          "increment_admins&user_missions_number_of_ordes_so_far",
          {
            id: adminID,
            mission_id: userMissionInfo[0].id,
          }
        );

        toast({
          title: `${username?.username} adlı müşterinin işlemi başarıyla gerçekleştirildi.`,
          description: `Bugüne kadar sipariş edilen kahve sayısı: ${
            userMissionInfo[0].customer_number_of_orders_so_far + 1
          } ${"\n"} Müşterinin ödül hakkı: ${
            userMissionInfo[0].number_of_free_rights === null
              ? 0
              : userMissionInfo[0].number_of_free_rights
          }`,
        });
      } else if (
        numberForReward &&
        userMissionInfo &&
        userMissionInfo[0].number_of_orders ===
          numberForReward[0].number_for_reward - 1
      ) {
        // If the user has a record in the user_missions table and the number of orders is equal to the number_for_reward, make request
        try {
          // Increment not_used_nfts from admins table and number_of_free_rights from user_missions table
          await supabase.rpc(
            "increment_admins&user_missions_number_of_free_rights",
            {
              id: adminID,
              mission_id: userMissionInfo[0].id,
            }
          );

          await supabase.rpc(
            "increment_admins&user_missions_number_of_ordes_so_far",
            {
              id: adminID,
              mission_id: userMissionInfo[0].id,
            }
          );

          const { error: zeroError } = await secretSupabase
            .from("user_missions")
            .update({
              number_of_orders: 0,
            })
            .eq("user_id", userID)
            .eq("admin_id", adminID);

          if (zeroError) {
            toast({
              variant: "destructive",
              title: "Bir şeyler yanlış gitti.",
              description: "Lütfen tekrar deneyiniz.",
            });
          } else {
            toast({
              title: `${username} adlı müşteriniz ödülünüzü kazandı.`,
              description: `Bugüne kadar sipariş edilen kahve sayısı: ${
                userMissionInfo[0].customer_number_of_orders_so_far + 1
              } ${"\n"} Müşterinin ödül hakkı: ${
                userMissionInfo[0].number_of_free_rights === null
                  ? 1
                  : userMissionInfo[0].number_of_free_rights + 1
              }`,
            });
          }
        } catch (error) {
          console.log("error", error);
          toast({
            variant: "destructive",

            title: "Müşteriye ödülü verilemedi.",
            description: "Lütfen tekrar deneyiniz.",
          });
        }
      }
    }
  };

  useEffect(() => {
    if (scannedResult) {
      handleScan();
    }
  }, [scannedResult]);

  useEffect(() => {
    if (videoEl?.current && !scanner.current) {
      // 👉 Instantiate the QR Scanner
      scanner.current = new QrScanner(videoEl?.current, onScanSuccess, {
        // onDecodeError: onScanFail,
        // 📷 This is the camera facing mode. In mobile devices, "environment" means back camera and "user" means front camera.
        preferredCamera: "environment",
        // 🖼 This will help us position our "QrFrame.svg" so that user can only scan when qr code is put in between our QrFrame.svg.
        highlightScanRegion: true,
        // 🔥 This will produce a yellow (default color) outline around the qr code that we scan, showing a proof that our qr-scanner is scanning that qr code.
        highlightCodeOutline: true,
        // 📦 A custom div which will pair with "highlightScanRegion" option above 👆. This gives us full control over our scan region.
        overlay: qrBoxEl?.current || undefined,
      });

      // 🚀 Start QR Scanner
      scanner?.current
        ?.start()
        .then(() => setQrOn(true))
        .catch((err) => {
          if (err) setQrOn(false);
        });
    }

    // 🧹 Clean up on unmount.
    // 🚨 This removes the QR Scanner from rendering and using camera when it is closed or removed from the UI.
    return () => {
      if (!videoEl?.current) {
        scanner?.current?.stop();
      }
    };
  }, []);

  // ❌ If "camera" is not allowed in browser permissions, show an alert.
  useEffect(() => {
    if (!qrOn)
      alert(
        "Kamera engellendi veya erişilemiyor. Lütfen tarayıcı izinlerinizde kameraya izin verin ve sayfayı yenileyin."
      );
  }, [qrOn]);

  return (
    <div className="w-screen h-screen">
      <Toaster />
      <div className="bg-[#4b4a4a5d] p-36">
        <video ref={videoEl} className="border-2 border-lad-purple"></video>
      </div>
      <div ref={qrBoxEl}></div>
    </div>
  );
};

export default AdminCamera;
