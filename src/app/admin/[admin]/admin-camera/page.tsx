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

import { createClient, createServiceClient } from "@/src/lib/supabase/client";

export default function AdminCamera() {
  const isScanned = useRef<boolean>(false);
  const supabase = createClient();
  const secretSupabase = createServiceClient();
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

      if (admin === null) {
        router.push("/");
      }

      const { data: userMissionInfo } = await supabase
        .from("user_missions")
        .select(
          "number_of_orders, id, customer_number_of_orders_so_far, number_of_free_rights, used_rewards"
        )
        .eq("user_id", userID)
        .eq("admin_id", admin?.id);

      // get number_for_reward from admin table
      const { data: numberForReward } = await supabase
        .from("admins")
        .select("number_for_reward")
        .eq("id", admin?.id);

      const { data: username } = await secretSupabase
        .from("users")
        .select("username")
        .eq("id", userID)
        .single();

      if (forNFT === true && userMissionInfo) {
        if (admin?.id !== adminID) {
          toast.error(
            "Müşteriniz başka işletmenin ödülünün qr kodunu kullanmaktadır. Lütfen müşterinizden doğru qr kodu okutmasını isteyiniz."
          );
        }

        if (userMissionInfo[0].number_of_free_rights === 0) {
          toast.error("Müşterinizin ödül hakkı kalmamıştır.");
        }

        await supabase.rpc("decrement_admins_not_used_nfts", {
          admin_id: admin?.id,
        });

        await supabase.rpc("increment_admins_used_rewards", {
          admin_id: admin?.id,
        });

        await supabase.rpc("decrement_user_missions_number_of_free_rigths", {
          mission_id: userMissionInfo[0].id,
        });

        await supabase.rpc("increment_admins_number_of_orders_so_far", {
          admin_id: admin?.id,
        });

        await supabase.rpc("increment_user_missions_number_of_orders_so_far", {
          mission_id: userMissionInfo[0].id,
        });

        toast.success(
          <p>
            <span className="font-bold">{username?.username}</span> adlı
            müşteriniz ödülünüzü kullandı. <br />
            Bugüne kadar verilen sipariş sayısı:{" "}
            {userMissionInfo[0].customer_number_of_orders_so_far + 1} <br />
            Kalan ödül hakkı: {userMissionInfo[0].number_of_free_rights -
              1}{" "}
            <br />
            Bugüne kadar kullandığı ödül sayısı:{" "}
            {userMissionInfo[0].used_rewards + 1}
          </p>
        );
      }
      // If the order is not for free, check the number of orders
      else {
        if (userMissionInfo?.length === 0) {
          console.log("İlk giriş");
          // If the user does not have a record in the user_missions table, add a new record
          const { data: missionId } = await supabase
            .from("user_missions")
            .insert({
              number_of_orders: 1,
              user_id: userID,
              admin_id: admin?.id,
            })
            .select("id");

          if (missionId === null) {
            return;
          }

          await supabase.rpc(
            "increment_user_missions_number_of_orders_so_far",
            {
              mission_id: missionId[0].id,
            }
          );

          await supabase.rpc("increment_admins_number_of_orders_so_far", {
            admin_id: admin?.id,
          });

          toast.success(
            <p>
              {username?.username} adlı müşterinizin işlemi başarıyla
              gerçekleştirildi. <br />
              <span className="font-bold">İlk sipariş!</span>
            </p>
          );
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

          await supabase.rpc("increment_admins_number_of_orders_so_far", {
            admin_id: admin?.id,
          });

          await supabase.rpc(
            "increment_user_missions_number_of_orders_so_far",
            {
              mission_id: userMissionInfo[0].id,
            }
          );

          toast.success(
            <p>
              <span className="font-bold">{username?.username}</span> adlı
              müşterinin işlemi başarıyla gerçekleştirildi. <br />
              Bugüne kadar sipariş edilen kahve sayısı:{""}
              {userMissionInfo[0].customer_number_of_orders_so_far + 1} <br />
              Müşterinin ödül hakkı:{""}
              {userMissionInfo[0].number_of_free_rights === null
                ? 0
                : userMissionInfo[0].number_of_free_rights}{" "}
              <br />
              Bugüne kadar kullandığı ödül sayısı:{" "}
              {userMissionInfo[0].used_rewards}
            </p>
          );
        } else if (
          numberForReward &&
          userMissionInfo &&
          userMissionInfo[0].number_of_orders ===
            numberForReward[0].number_for_reward - 1
        ) {
          // If the user has a record in the user_missions table and the number of orders is equal to the number_for_reward, make request
          try {
            await supabase.rpc("increment_admins_not_used_nfts", {
              admin_id: admin?.id,
            });

            await supabase.rpc(
              "increment_user_missions_number_of_free_rigths",
              {
                mission_id: userMissionInfo[0].id,
              }
            );

            await supabase.rpc("increment_admins_number_of_orders_so_far", {
              admin_id: admin?.id,
            });

            await supabase.rpc(
              "increment_user_missions_number_of_orders_so_far",
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
              .eq("admin_id", admin?.id);

            if (zeroError) {
              toast.error("Bir şeyler yanlış gitti. Lütfen tekrar deneyiniz.");
            } else {
              toast.success(
                <p>
                  <span className="font-bold">{username?.username}</span>
                  adlı müşteriniz ödülünüzü kazandı. <br />
                  Bugüne kadar sipariş edilen kahve sayısı:{""}
                  {userMissionInfo[0].customer_number_of_orders_so_far + 1}
                  <br />
                  Müşterinin ödül hakkı:{""}
                  {userMissionInfo[0].number_of_free_rights === null
                    ? 1
                    : userMissionInfo[0].number_of_free_rights + 1}
                  Bugüne kadar kullandığı ödül sayısı:{" "}
                  {userMissionInfo[0].used_rewards}
                </p>
              );
            }
          } catch (error) {
            console.log("error", error);
            toast.error("Müşteriye ödülü verilemedi.Lütfen tekrar deneyiniz.");
          }
        }
      }
    } catch (error) {
      console.log("error", error);
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
        onError={(error) => console.log(error?.message)}
        stopDecoding={isScanned.current}
        scanDelay={5000}
      />
    </>
  );
}
