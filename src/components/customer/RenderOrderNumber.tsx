"use client";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/src/lib/supabase/client";
import Image from "next/image";

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
  const [screenWidth, setScreenWidth] = useState<number | null>(null);
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

  useEffect(() => {
    setScreenWidth(window.innerWidth);

    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // @todo - TICKETIN DÜZELTİLMESİ LAZIM
  return (
    <section className="pt-16 w-full">
      <div className="w-full min-[320px]:h-40 min-[375px]:h-44 min-[425px]:h-48 min-[475px]:h-52 min-[525px]:h-56 min-[600px]:h-60 min-[675px]:h-72 relative">
        <Image
          src={
            adminInfo &&
            adminInfo[0]?.ticket_ipfs_url?.replace(
              "ipfs://",
              "https://ipfs.io/ipfs/"
            )
          }
          alt="Ticket"
          fill
        />
        <ul
          className={`h-full w-2/3 absolute right-0 grid ${
            ticketCircles.length === 4
              ? "grid-cols-2"
              : ticketCircles.length === 5
              ? "grid-cols-3"
              : ticketCircles.length === 6
              ? "grid-cols-3"
              : ticketCircles.length === 7
              ? "grid-cols-4"
              : "grid-cols-4"
          } justify-items-center content-around`}>
          {ticketCircles.map((_, index) => (
            <li
              key={index}
              className="min-[320px]:w-6 min-[320px]:h-6 min-[375px]:w-8 min-[375px]:h-8 min-[425px]:w-9 min-[425px]:h-9 min-[525px]:w-12 min-[525px]:h-12 min-[600px]:w-14 min-[600px]:h-14 min-[675px]:h-16 min-[675px]:w-16 rounded-full z-10 ring ring-[#7B3501] ring-offset-2"
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
              }}></li>
          ))}
        </ul>
      </div>
    </section>
  );
}
