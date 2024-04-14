"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";

import useAdminForAdminStore from "@/src/store/adminStoreForAdmin";
import supabase, { secretSupabase } from "@/src/utils/supabase";
import { toast } from "@/src/components/ui/use-toast";
import { Toaster } from "@/src/components/ui/toaster";

const AdminCamera = () => {
  const [qrOn, setQrOn] = useState<boolean>(true);
  const [scannedResult, setScannedResult] = useState<string | undefined>("");

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
    console.log("data", userID, forNFT, address);
    const { data: userMissionInfo } = await supabase
      .from("user_missions")
      .select("number_of_orders, id")
      .eq("user_id", userID)
      .eq("admin_id", adminID);
    // get number_for_reward from admin table
    const { data: numberForReward } = await supabase
      .from("admins")
      .select("number_for_reward")
      .eq("id", adminID);
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
        let { data, error } = await supabase.rpc(
          "decrement_user_missions_number_of_free_rights",
          {
            mission_id: userMissionInfo[0].id,
          }
        );
        toast({ title: "Müşteriniz ödülünüzü kullandı." });
      } else {
        toast({
          title: "Müşteri ödülünü kullanamadı.",
          description: "Lütfen tekrar deneyiniz.",
        });
      }
    }
    // If the order is not for free, check the number of orders
    else {
      if (userMissionInfo?.length === 0) {
        // If the user does not have a record in the user_missions table, add a new record
        const { data, error } = await secretSupabase
          .from("user_missions")
          .insert({
            number_of_orders: 1,
            user_id: userID,
            admin_id: adminID,
          });
        toast({ title: "İşlem başarıyla gerçekleşti." });
      } else if (
        numberForReward &&
        userMissionInfo &&
        userMissionInfo[0].number_of_orders <
          numberForReward[0].number_for_reward - 1
      ) {
        // If the user has a record in the user_missions table and the number of orders is less than the number_for_reward, increase the number of orders by one
        let { data, error } = await supabase.rpc(
          "increment_user_missions_number_of_orders",
          {
            mission_id: userMissionInfo[0].id,
          }
        );
        if (error) console.error(error);
        else console.log(data);
        toast({ title: "İşlem başarıyla gerçekleşti." });
      } else if (
        numberForReward &&
        userMissionInfo &&
        userMissionInfo[0].number_of_orders ===
          numberForReward[0].number_for_reward - 1
      ) {
        // If the user has a record in the user_missions table and the number of orders is equal to the number_for_reward, make request
        try {
          const { data, error: incrementError } = await supabase.rpc(
            "increment_user_missions_number_of_free_rights",
            {
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
          console.log("here", data, zeroError);
          if (zeroError) {
            toast({
              title: "Bir şeyler yanlış gitti.",
              description: "Lütfen tekrar deneyiniz.",
            });
          } else {
            toast({ title: "Müşteriniz ödülünüzü kazandı." });
          }
        } catch (error) {
          console.log("error", error);
          toast({
            title: "Müşteriye ödülü verilemedi.",
            description: "Lütfen tekrar deneyiniz.",
          });
        }
      }
    }
  };

  const onScanFail = (err: string | Error) => {
    // 🖨 Print the "err" to browser console.
    console.log(err);
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
        "Camera is blocked or not accessible. Please allow camera in your browser permissions and Reload."
      );
  }, [qrOn]);

  return (
    <div className="qr-reader">
      {/* QR */}
      <Toaster />
      <video ref={videoEl}></video>
      <div ref={qrBoxEl} className="qr-box"></div>

      {/* Show Data Result if scan is success */}
      {scannedResult && (
        <p
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 99999,
            color: "white",
          }}>
          Scanned Result: {scannedResult}
        </p>
      )}
    </div>
  );
};

export default AdminCamera;
