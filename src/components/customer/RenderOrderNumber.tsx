"use client";
import { useEffect, useRef } from "react";
import { useAddress, useContract, useMintNFT } from "@thirdweb-dev/react";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { createClient } from "@/src/lib/supabase/client";

type RenderOrderNumberProps = {
  adminInfo:
    | {
        number_for_reward: any;
        ticket_ipfs_url: any;
        brand_logo_ipfs_url: any;
        campaigns: any;
        contract_address: any;
        collection_metadata: any;
      }[]
    | null;
  userMissionNumbers:
    | {
        number_of_orders: any;
        number_of_free_rights: any;
      }[]
    | null;
  userID: string | undefined;
};

export default function RenderOrderNumber({
  adminInfo,
  userID,
  userMissionNumbers,
}: RenderOrderNumberProps) {
  const userOrderNumberRef = useRef<number>(
    userMissionNumbers && userMissionNumbers[0]?.number_of_orders
  );
  const supabase = createClient();
  const customerAddress = useAddress();
  const { contract } = useContract(adminInfo && adminInfo[0]?.contract_address);
  const { mutateAsync: mintNFT, isLoading, error } = useMintNFT(contract);
  const ticketCircles = adminInfo
    ? new Array(adminInfo[0].number_for_reward).fill(0)
    : [];

  useEffect(() => {
    const orders = supabase
      .channel("orders-change-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "user_missions",
          filter: `user_id=eq.${userID}`,
        },
        (payload: any) => {
          userOrderNumberRef.current = payload.new.number_of_orders;
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(orders);
    };
  }, [userID, supabase]);

  useEffect(() => {
    const mintingNFT = supabase
      .channel("number-of-free-rights-channel")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "user_missions",
          filter: `user_id=eq.${userID}`,
        },
        (payload: any) => {
          if (
            userMissionNumbers &&
            userMissionNumbers[0].number_of_free_rights - 1 ===
              payload.new.number_of_free_rights
          ) {
            console.log(payload.new);
            toast.info(
              "Tebrikler! Ödülünüzü kullandınız. Hatıra NFT'nizi en geç 2 dk içinde 'Profil' sayfanızdan görebilirsiniz.",
              {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
              }
            );
            mintNFT({
              metadata: adminInfo && adminInfo[0].collection_metadata,
              to: String(customerAddress),
            });
          }
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(mintingNFT);
    };
  }, [
    adminInfo,
    userMissionNumbers,
    customerAddress,
    mintNFT,
    userID,
    supabase,
  ]);

  return (
    <div className="pt-12 h-1/2 w-full">
      <ToastContainer />
      <div
        className="w-full h-full grid grid-cols-4 gap-2 justify-items-start items-start bg-no-repeat bg-contain pt-4 pl-36"
        style={{
          backgroundImage: `url(${
            adminInfo &&
            adminInfo[0]?.ticket_ipfs_url?.replace(
              "ipfs://",
              "https://ipfs.io/ipfs/"
            )
          })`,
          gridTemplateColumns: "repeat(4, 1fr)",
          gridTemplateRows: "repeat(auto-fill, minmax(50px, 1fr))",
        }}>
        {ticketCircles.map((_, index) => (
          <div
            key={index}
            className={`w-12 h-12 rounded-full z-10 ${
              index >= 4 ? "mt-10" : ""
            }`}
            style={{
              background:
                userMissionNumbers &&
                index < userMissionNumbers[0]?.number_of_orders
                  ? `url(${
                      adminInfo &&
                      adminInfo[0].brand_logo_ipfs_url.replace(
                        "ipfs://",
                        "https://ipfs.io/ipfs/"
                      )
                    }) no-repeat center center`
                  : "#7B3501",
              backgroundSize: "cover",
              transform: "rotate(-45deg)",
            }}></div>
        ))}
      </div>
    </div>
  );
}
