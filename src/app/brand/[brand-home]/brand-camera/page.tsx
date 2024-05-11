"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dynamic from "next/dynamic";
const QrScanner = dynamic(
  () => import("@yudiel/react-qr-scanner").then((mod) => mod.QrScanner),
  {
    ssr: false,
  }
);

import { createClient } from "@/src/lib/supabase/client";
import getUserID from "@/src/lib/getUserID";

export default function BranchCamera() {
  const isScanned = useRef<boolean>(false);
  const supabase = createClient();
  const router = useRouter();

  const handleScan = async (result: any) => {
    if (!result || isScanned.current) return;
    isScanned.current = true;
    try {
      const { userID, forNFT, brandBranchID } = JSON.parse(result);
      const branchID = await getUserID();

      if (branchID !== brandBranchID) {
        toast.error(
          "Müşteri başka bir işletmenin QR kodunu okutmaktadır. Lütfen kendi markanızdaki qr kodunu isteyiniz."
        );
        return;
      }

      const days = ["pzr", "pzt", "salı", "çrş", "prş", "cuma", "cmt"];
      const currentDay = days[new Date().getDay()];

      const { data: user } = await supabase
        .from("users")
        .select("username, wallet_addr")
        .eq("id", userID)
        .single();

      console.log("user", user);

      const { data: userOrderInfo } = await supabase
        .from("user_orders")
        .select(
          "id, total_user_orders, total_ticket_orders, user_total_used_free_rights"
        )
        .eq("user_id", userID)
        .eq("branch_id", branchID)
        .single();

      console.log("userOrderInfo", userOrderInfo);

      const { data: brandBranchInfo } = await supabase
        .from("brand_branch")
        .select(
          "brand_id, total_used_free_rights, daily_total_used_free_rights, total_orders, daily_total_orders, weekly_total_orders, monthly_total_orders"
        )
        .eq("id", branchID);

      console.log("brandBranchInfo", brandBranchInfo);

      if (!brandBranchInfo) {
        toast.error("Şube bilgisi bulunamadı.");
        return;
      }

      const { data: brandInfo } = await supabase
        .from("brand")
        .select("required_number_for_free_right, total_unused_free_rights")
        .eq("id", brandBranchInfo[0].brand_id);

      console.log("brandInfo", brandInfo);

      if (!brandInfo) {
        toast.error("İşletme bilgisi bulunamadı.");
        return;
      }

      // BUGLI BİR KOD. ŞUBELERE GEÇİLDİĞİNDE DÜZELTİLECEK
      const { data: userTotalFreeRights } = await supabase
        .from("user_orders")
        .select("user_total_free_rights")
        .eq("user_id", userID)
        .eq("brand_id", brandBranchInfo[0].brand_id);

      console.log("userTotalFreeRights", userTotalFreeRights);

      const totalUserFreeRights =
        userTotalFreeRights &&
        userTotalFreeRights.reduce(
          (total, item) => total + item.user_total_free_rights,
          0
        );

      if (forNFT === true) {
        if (totalUserFreeRights === 0) {
          toast.error("Müşterinizin ödül hakkı kalmamıştır.");
        }

        try {
          await supabase
            .from("user_orders")
            .update({
              user_total_free_rights: Number(
                totalUserFreeRights && totalUserFreeRights - 1
              ),
              user_total_used_free_rights: Number(
                userOrderInfo && userOrderInfo.user_total_used_free_rights + 1
              ),
              total_user_orders: Number(
                userOrderInfo && userOrderInfo.total_user_orders + 1
              ),
            })
            .eq("id", (userOrderInfo && userOrderInfo.id) || "");

          await supabase
            .from("brand_branch")
            .update({
              total_orders: Number(brandBranchInfo[0].total_orders + 1),
              daily_total_orders: Number(
                brandBranchInfo[0].daily_total_orders + 1
              ),
              total_used_free_rights: Number(
                brandBranchInfo[0].total_used_free_rights + 1
              ),
              daily_total_used_free_rights: Number(
                brandBranchInfo[0].daily_total_used_free_rights + 1
              ),
              weekly_total_orders: {
                [currentDay]: Number(
                  (
                    brandBranchInfo[0].weekly_total_orders as {
                      [key: string]: number;
                    }
                  )[currentDay] + 1
                ),
              },
              monthly_total_orders: Number(
                brandBranchInfo[0].monthly_total_orders + 1
              ),
            })
            .eq("id", branchID);

          const { error } = await supabase
            .from("brand")
            .update({
              total_unused_free_rights: Number(
                brandInfo[0].total_unused_free_rights - 1
              ),
            })
            .eq("id", brandBranchInfo[0].brand_id);

          console.log(error);

          if (userOrderInfo) {
            toast.success(
              <p>
                <span className="font-bold">{user?.username}</span> adlı
                müşteriniz ödülünüzü kullandı. <br />
                Bugüne kadar verilen sipariş sayısı:{" "}
                {userOrderInfo.total_user_orders + 1} <br />
                Kalan ödül hakkı:{" "}
                {totalUserFreeRights && totalUserFreeRights - 1} <br />
                Bugüne kadar kullandığı ödül sayısı:{" "}
                {userOrderInfo.user_total_used_free_rights + 1}
              </p>
            );
          }
        } catch (error) {
          toast.error("Müşteri ödülünü kullanamadı. Lütfen tekrar deneyiniz.");
        }
      }
      // If the order is not for free, check total_ticket_orders
      else {
        if (!userOrderInfo) {
          // If the user does not have a record in the user_orders table, add a new record

          try {
            await supabase.from("user_orders").insert({
              user_id: String(userID),
              branch_id: String(branchID),
              brand_id: String(brandBranchInfo[0].brand_id),
              total_user_orders: 1,
              total_ticket_orders: 1,
            });

            await supabase
              .from("brand_branch")
              .update({
                total_orders: Number(brandBranchInfo[0].total_orders + 1),
                daily_total_orders: Number(
                  brandBranchInfo[0].daily_total_orders + 1
                ),
                weekly_total_orders: {
                  [currentDay]: Number(
                    (
                      brandBranchInfo[0].weekly_total_orders as {
                        [key: string]: number;
                      }
                    )[currentDay] + 1
                  ),
                },
                monthly_total_orders: Number(
                  brandBranchInfo[0].monthly_total_orders + 1
                ),
              })
              .eq("id", branchID);

            toast.success(
              <p>
                {user?.username} adlı müşterinizin işlemi başarıyla
                gerçekleştirildi. <br />
                <span className="font-bold">İlk sipariş!</span>
              </p>
            );
          } catch (error) {
            toast.error("Müşteri siparişi alınamadı. Lütfen tekrar deneyiniz.");
          }
        } else if (
          Number(brandInfo[0]?.required_number_for_free_right) - 1 >
          userOrderInfo.total_ticket_orders
        ) {
          // If the user has a record in the user_orders table and the ticket orders is less than the requiredNumberForFreeRight, increase the ticket orders by one

          try {
            const { error: userOrderError } = await supabase
              .from("user_orders")
              .update({
                total_ticket_orders: Number(
                  userOrderInfo.total_ticket_orders + 1
                ),
                total_user_orders: Number(userOrderInfo.total_user_orders + 1),
              })
              .eq("id", userOrderInfo.id);

            console.log(userOrderError);

            const { error: brandBranchError } = await supabase
              .from("brand_branch")
              .update({
                total_orders: Number(brandBranchInfo[0].total_orders + 1),
                daily_total_orders: Number(
                  brandBranchInfo[0].daily_total_orders + 1
                ),
                weekly_total_orders: {
                  [currentDay]: Number(
                    (
                      brandBranchInfo[0].weekly_total_orders as {
                        [key: string]: number;
                      }
                    )[currentDay] + 1
                  ),
                },
                monthly_total_orders: Number(
                  brandBranchInfo[0].monthly_total_orders + 1
                ),
              })
              .eq("id", branchID);

            console.log(brandBranchError);

            toast.success(
              <p>
                <span className="font-bold">{user?.username}</span> adlı
                müşterinin işlemi başarıyla gerçekleştirildi. <br />
                Bugüne kadar sipariş edilen kahve sayısı:{""}
                {userOrderInfo.total_user_orders + 1} <br />
                Müşterinin ödül hakkı:{""}
                {totalUserFreeRights} <br />
                Bugüne kadar kullandığı ödül sayısı:{" "}
                {userOrderInfo.user_total_used_free_rights}
              </p>
            );
          } catch (error) {
            toast.error("Müşteri siparişi alınamadı. Lütfen tekrar deneyiniz.");
          }
        } else if (
          userOrderInfo.total_ticket_orders ===
          Number(brandInfo[0]?.required_number_for_free_right) - 1
        ) {
          // If the user has a record in the user_orders table and the ticket orders will be equal to the requiredNumberForFreeRight, increase user_total_free_rights by one and make zero the total_ticket_orders
          try {
            await supabase
              .from("user_orders")
              .update({
                total_ticket_orders: 0,
                total_user_orders: Number(userOrderInfo.total_user_orders + 1),
                user_total_free_rights: Number(
                  totalUserFreeRights ? totalUserFreeRights + 1 : 1
                ),
              })
              .eq("id", userOrderInfo.id);

            await supabase
              .from("brand_branch")
              .update({
                total_orders: Number(brandBranchInfo[0].total_orders + 1),
                daily_total_orders: Number(
                  brandBranchInfo[0].daily_total_orders + 1
                ),
                weekly_total_orders: {
                  [currentDay]: Number(
                    (
                      brandBranchInfo[0].weekly_total_orders as {
                        [key: string]: number;
                      }
                    )[currentDay] + 1
                  ),
                },
                monthly_total_orders: Number(
                  brandBranchInfo[0].monthly_total_orders + 1
                ),
              })
              .eq("id", branchID);

            await supabase
              .from("brand")
              .update({
                total_unused_free_rights: Number(
                  brandInfo[0].total_unused_free_rights + 1
                ),
              })
              .eq("id", brandBranchInfo[0].brand_id);

            toast.success(
              <p>
                <span className="font-bold">{user?.username}</span>
                adlı müşteriniz ödülünüzü kazandı. <br />
                Bugüne kadar sipariş edilen kahve sayısı:{""}
                {userOrderInfo.total_user_orders + 1}
                <br />
                Müşterinin ödül hakkı:{""}
                {totalUserFreeRights ? totalUserFreeRights + 1 : 1} <br />
                Bugüne kadar kullandığı ödül sayısı:{" "}
                {userOrderInfo.user_total_used_free_rights}
              </p>
            );
          } catch (error) {
            toast.error("Müşteriye ödülü verilemedi.Lütfen tekrar deneyiniz.");
          }
        }
      }
    } catch (error) {
      toast.error("Bir şeyler yanlış gitti. Lütfen tekrar deneyiniz.");
    } finally {
      setTimeout(() => {
        isScanned.current = false;
      }, 5000);
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
      <QrScanner
        constraints={{ facingMode: "environment" }}
        onDecode={handleScan}
        stopDecoding={isScanned.current}
        scanDelay={5000}
      />
    </>
  );
}
