"use client";
import { useEffect, useRef } from "react";
import { createClient } from "@/src/lib/supabase/client";

type RenderOrderNumberProps = {
  adminInfo:
    | {
        number_for_reward: any;
        ticket_ipfs_url: any;
        brand_logo_ipfs_url: any;
      }[]
    | null;
  userMissionNumbers:
    | {
        number_of_orders: any;
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

  return (
    <div className="pt-12 h-1/2 w-full">
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
