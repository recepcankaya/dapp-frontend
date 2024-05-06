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

export default function AdminCamera() {
  const isScanned = useRef<boolean>(false);
  const supabase = createClient();
  const router = useRouter();

  const handleScan = async (result: any) => {
    if (!result || isScanned.current) return;
    isScanned.current = true;
    try {
      const { userID, forNFT, address, adminID } = JSON.parse(result);
      console.log("Okutuldu");
      const {
        data: { user: admin },
      } = await supabase.auth.getUser();

      if (!admin) {
        router.push("/");
      }

      const { data: userOrderInfo } = await supabase
        .from("user_orders")
        .select(
          "id, total_user_orders, total_ticket_orders, user_total_free_rights, user_total_used_free_rights"
        )
        .eq("user_id", userID)
        .eq("admin_id", admin?.id || "")
        .single();

      const { data: requiredNumberForFreeRight } = await supabase
        .from("brand_branch")
        .select(
          "required_number_for_free_right, total_unused_free_rigths, total_used_free_rights, total_orders"
        )
        .eq("id", admin?.id || "")
        .single();

      const { data: username } = await supabase
        .from("users")
        .select("username")
        .eq("id", userID)
        .single();

      if (!userOrderInfo || !requiredNumberForFreeRight) {
        toast.error("Kullanıcıya ait sipariş bilgisi bulunamadı.");
        return;
      }

      if (forNFT === true) {
        if (admin?.id !== adminID) {
          toast.error(
            "Müşteriniz başka işletmenin ödülünün qr kodunu kullanmaktadır. Lütfen müşterinizden doğru qr kodu okutmasını isteyiniz."
          );
        }

        if (userOrderInfo?.user_total_free_rights === 0) {
          toast.error("Müşterinizin ödül hakkı kalmamıştır.");
        }

        await supabase.from("user_orders").update({
          user_total_free_rights: Number(
            userOrderInfo.user_total_free_rights - 1
          ),
          user_total_used_free_rights: Number(
            userOrderInfo.user_total_used_free_rights + 1
          ),
          total_user_orders: Number(userOrderInfo.total_user_orders + 1),
        });

        await supabase.from("brand_branch").update({
          total_orders: Number(requiredNumberForFreeRight.total_orders + 1),
          total_unused_free_rigths: Number(
            requiredNumberForFreeRight.total_unused_free_rigths - 1
          ),
          total_used_free_rights: Number(
            requiredNumberForFreeRight.total_used_free_rights + 1
          ),
        });

        // +
        // await supabase.rpc("decrement_admins_not_used_nfts", {
        //   admin_id: admin?.id || "",
        // });

        // +
        // await supabase.rpc("increment_admins_used_rewards", {
        //   admin_id: admin?.id || "",
        // });

        // +
        // await supabase.rpc("decrement_user_missions_number_of_free_rigths", {
        //   mission_id: userOrderInfo.id,
        // });

        // +
        // await supabase.rpc("increment_user_missions_used_rewards", {
        //   mission_id: userOrderInfo.id,
        // });

        // +
        // await supabase.rpc("increment_admins_number_of_orders_so_far", {
        //   admin_id: admin?.id || "",
        // });

        // +
        // await supabase.rpc("increment_user_missions_number_of_orders_so_far", {
        //   mission_id: userOrderInfo.id,
        // });

        toast.success(
          <p>
            <span className="font-bold">{username?.username}</span> adlı
            müşteriniz ödülünüzü kullandı. <br />
            Bugüne kadar verilen sipariş sayısı:{" "}
            {userOrderInfo.total_user_orders + 1} <br />
            Kalan ödül hakkı:{" "}
            {userOrderInfo.user_total_free_rights - 1 === 0
              ? 0
              : userOrderInfo.user_total_free_rights - 1}{" "}
            <br />
            Bugüne kadar kullandığı ödül sayısı:{" "}
            {userOrderInfo.user_total_used_free_rights + 1}
          </p>
        );
      }
      // If the order is not for free, check the number of orders
      else {
        if (userOrderInfo.total_user_orders === 0) {
          // If the user does not have a record in the user_orders table, add a new record
          const { data: orderId } = await supabase
            .from("user_orders")
            .insert({
              total_user_orders: 1,
              user_id: userID,
              brand_id: admin?.id || "",
            })
            .select("id")
            .single();

          await supabase.rpc(
            "increment_user_missions_number_of_orders_so_far",
            {
              mission_id: orderId ? orderId.id : "",
            }
          );

          await supabase.rpc("increment_admins_number_of_orders_so_far", {
            admin_id: admin?.id || "",
          });

          toast.success(
            <p>
              {username?.username} adlı müşterinizin işlemi başarıyla
              gerçekleştirildi. <br />
              <span className="font-bold">İlk sipariş!</span>
            </p>
          );
        } else if (
          Number(requiredNumberForFreeRight?.required_number_for_free_right) -
            1 >
          userOrderInfo.total_ticket_orders
        ) {
          // If the user has a record in the user_orders table and the ticket orders is less than the requiredNumberForFreeRight, increase the ticket orders by one
          await supabase.rpc("increment_user_missions_number_of_orders", {
            mission_id: userOrderInfo.id,
          });

          await supabase.rpc("increment_admins_number_of_orders_so_far", {
            admin_id: admin?.id || "",
          });

          await supabase.rpc(
            "increment_user_missions_number_of_orders_so_far",
            {
              mission_id: userOrderInfo.id,
            }
          );

          toast.success(
            <p>
              <span className="font-bold">{username?.username}</span> adlı
              müşterinin işlemi başarıyla gerçekleştirildi. <br />
              Bugüne kadar sipariş edilen kahve sayısı:{""}
              {userOrderInfo.total_user_orders + 1} <br />
              Müşterinin ödül hakkı:{""}
              {userOrderInfo.user_total_free_rights} <br />
              Bugüne kadar kullandığı ödül sayısı:{" "}
              {userOrderInfo.user_total_used_free_rights}
            </p>
          );
        } else if (
          userOrderInfo.total_ticket_orders ===
          Number(requiredNumberForFreeRight?.required_number_for_free_right) - 1
        ) {
          // If the user has a record in the user_orders table and the ticket orders is equal to the requiredNumberForFreeRight, make a request
          try {
            await supabase.rpc("increment_admins_not_used_nfts", {
              admin_id: admin?.id || "",
            });

            await supabase.rpc(
              "increment_user_missions_number_of_free_rigths",
              {
                mission_id: userOrderInfo.id,
              }
            );

            await supabase.rpc("increment_admins_number_of_orders_so_far", {
              admin_id: admin?.id || "",
            });

            await supabase.rpc(
              "increment_user_missions_number_of_orders_so_far",
              {
                mission_id: userOrderInfo.id,
              }
            );

            const { error: zeroError } = await supabase
              .from("user_missions")
              .update({
                number_of_orders: 0,
              })
              .eq("user_id", userID)
              .eq("admin_id", admin?.id || "");

            if (zeroError) {
              toast.error("Bir şeyler yanlış gitti. Lütfen tekrar deneyiniz.");
            } else {
              toast.success(
                <p>
                  <span className="font-bold">{username?.username}</span>
                  adlı müşteriniz ödülünüzü kazandı. <br />
                  Bugüne kadar sipariş edilen kahve sayısı:{""}
                  {userOrderInfo.total_user_orders + 1}
                  <br />
                  Müşterinin ödül hakkı:{""}
                  {userOrderInfo.user_total_free_rights + 1}
                  Bugüne kadar kullandığı ödül sayısı:{" "}
                  {userOrderInfo.user_total_used_free_rights}
                </p>
              );
            }
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
