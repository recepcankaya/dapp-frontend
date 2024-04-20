"use client";

import { useRef } from "react";

import { toast } from "@/src/components/ui/use-toast";
import { Toaster } from "@/src/components/ui/toaster";
import { useRouter } from "next/navigation";
import { createClient, createServiceClient } from "@/src/lib/supabase/client";
import { QrScanner } from "@yudiel/react-qr-scanner";

const AdminCamera = () => {
  const isScanned = useRef<boolean>(false);
  const supabase = createClient();
  const secretSupabase = createServiceClient();

  const router = useRouter();

  const handleScan = async (result: any) => {
    if (!result || isScanned.current) return;
    isScanned.current = true;
    try {
      const { userID, forNFT, address } = JSON.parse(result);
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
          "number_of_orders, id, customer_number_of_orders_so_far, number_of_free_rights"
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
        const result = await fetch(
          "https://mint-nft-js.vercel.app/collectionNFT",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              admin_id: admin?.id,
              user_wallet: address,
            }),
          }
        );
        const { success } = await result.json();
        if (success === true) {
          await supabase.rpc("decrement_admins_not_used_nfts", {
            admin_id: admin?.id,
          });

          await supabase.rpc("decrement_user_missions_number_of_free_rigths", {
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

          const { error: adminsError } = await supabase.rpc(
            "increment_admins_number_of_orders_so_far",
            {
              admin_id: admin?.id,
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

          await supabase.rpc("increment_admins_number_of_orders_so_far", {
            admin_id: admin?.id,
          });

          await supabase.rpc(
            "increment_user_missions_number_of_orders_so_far",
            {
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
      <Toaster />
      <QrScanner
        constraints={{ facingMode: "environment" }}
        onDecode={handleScan}
        onError={(error) => console.log(error?.message)}
        stopDecoding={isScanned.current}
        scanDelay={5000}
      />
    </>
  );
};

export default AdminCamera;
