"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";

import { createClient } from "@/src/lib/supabase/client";
import { Button } from "../../ui/button";
import { useQuery } from "@tanstack/react-query";

type RenderTicketProps = {
  branchInfo: {
    campaigns: BrandBranch["campaigns"];
    video_url: BrandBranch["video_url"];
    brand: {
      required_number_for_free_right: Brand["required_number_for_free_right"];
      ticket_ipfs_url: Brand["ticket_ipfs_url"];
      brand_logo_ipfs_url: Brand["brand_logo_ipfs_url"];
    } | null;
  };
  totalTicketOrders: UserOrders["total_ticket_orders"];
  userID: User["id"];
};

function decodeTurkishCharacters(text: string) {
  return text
    .replace(/\ğ/g, "g")
    .replace(/\ü/g, "u")
    .replace(/\ş/g, "s")
    .replace(/\ı/g, "i")
    .replace(/\ö/g, "o")
    .replace(/\ç/g, "c");
}

export default function RenderTicket({
  branchInfo,
  userID,
  totalTicketOrders,
}: RenderTicketProps) {
  const [userOrderNumber, setUserOrderNumber] = useState(totalTicketOrders);
  const [menuURL, setMenuURL] = useState("");
  const params = useParams<{ brandName: string; brandBranch: string }>();
  const router = useRouter();
  const supabase = createClient();

  const ticketCircles = branchInfo
    ? new Array(branchInfo.brand?.required_number_for_free_right).fill(0)
    : [];
  const convertedBrandName = decodeTurkishCharacters(
    decodeURIComponent(params.brandName.toString())
  );
  const convertedBrandBranch = decodeTurkishCharacters(
    decodeURIComponent(params.brandBranch.toString())
  );

  /**
   * HATA - TOO MANY RE-RENDERS
  const { data: menu } = useQuery({
    queryKey: ["menus"],
    queryFn: async () =>
      await supabase.storage.from("menus").list("", {
        limit: 1,
        offset: 0,
        sortBy: { column: "name", order: "asc" },
        search: `${convertedBrandName}-${convertedBrandBranch}-menu.pdf`,
      }),
    });
    
    console.log(menu?.data);
    
    if (menu?.data?.length ?? 0 > 0) {
      const { data } = supabase.storage
      .from("menus")
      .getPublicUrl(`${convertedBrandName}-${convertedBrandBranch}-menu.pdf`);
      setMenuURL(data.publicUrl);
    }
    */

  const { data } = supabase.storage
    .from("menus")
    .getPublicUrl(`${convertedBrandName}-${convertedBrandBranch}-menu.pdf`);

  useEffect(() => {
    const orders = supabase
      .channel("orders-change-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "user_orders",
          filter: `user_id=eq.${userID}`,
        },
        (payload: any) => {
          setUserOrderNumber(payload.new.total_ticket_orders);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(orders);
    };
  }, [userID, supabase, router]);

  return (
    <section className="pt-16 w-full grid justify-items-center items-center">
      <div className="w-full min-[525px]:w-5/6 min-[320px]:h-40 min-[375px]:h-44 min-[425px]:h-48 min-[475px]:h-52 min-[525px]:h-56 min-[600px]:h-60 min-[675px]:h-72 relative">
        <Image
          src={
            branchInfo.brand?.ticket_ipfs_url?.replace(
              "ipfs://",
              "https://ipfs.io/ipfs/"
            ) || ""
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
                  index < totalTicketOrders
                    ? `url(${branchInfo.brand?.brand_logo_ipfs_url.replace(
                        "ipfs://",
                        "https://ipfs.io/ipfs/"
                      )}) no-repeat center center / contain`
                    : "#7B3501",
                transform: "rotate(-45deg)",
              }}></li>
          ))}
        </ul>
      </div>
      <Button
        asChild
        className="mt-16 px-16 py-6 mb-8 mx-auto flex text-lg font-bold rounded-xl border-2 border-lad-pink text-lad-white"
        type="submit">
        <a href={data.publicUrl} target="_blank" rel="noopener noreferrer">
          Menü
        </a>
      </Button>
    </section>
  );
}
