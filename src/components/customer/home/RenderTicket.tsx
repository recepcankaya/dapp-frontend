"use client";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/src/lib/supabase/client";
import Image from "next/image";
import { useRouter } from "next/navigation";

type RenderTicketProps = {
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

export default function RenderTicket({
  adminInfo,
  userID,
  userMissionNumbers,
}: RenderTicketProps) {
  const userOrderNumberRef = useRef<number>(
    userMissionNumbers && userMissionNumbers[0]?.number_of_orders
  );
  const supabase = createClient();
  const router = useRouter();
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
          router.refresh();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(orders);
    };
  }, [userID, supabase, router]);

  // @todo - TICKETIN DÜZELTİLMESİ LAZIM
  return (
    <section className="pt-16 w-full flex justify-center items-center">
      <div className="w-full min-[525px]:w-5/6 min-[320px]:h-40 min-[375px]:h-44 min-[425px]:h-48 min-[475px]:h-52 min-[525px]:h-56 min-[600px]:h-60 min-[675px]:h-72 relative">
        <Image
          src={
            adminInfo &&
            adminInfo[0]?.ticket_ipfs_url?.replace(
              "ipfs://",
              "https://ipfs.io/ipfs/"
            )
          }
          alt="Ticket"
          quality={100}
          priority
          fill
          sizes="(max-width: 525px) 100vw, 83.333333vw"
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
              className="min-[320px]:w-6 min-[320px]:h-6 min-[375px]:w-8 min-[375px]:h-8 min-[425px]:w-9 min-[425px]:h-9 min-[525px]:w-11 min-[525px]:h-11 min-[600px]:w-12 min-[600px]:h-12 min-[675px]:h-14 min-[675px]:w-14 rounded-full ring ring-[#7B3501] ring-offset-2"
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
                      }) no-repeat center center / contain`
                    : "#7B3501",
                transform: "rotate(-45deg)",
              }}></li>
          ))}
        </ul>
      </div>
    </section>
  );
}
