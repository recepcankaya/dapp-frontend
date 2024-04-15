"use client";
import useAdminStore from "@/src/store/adminStore";
import useUserStore from "@/src/store/userStore";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useRef } from "react";

export default function RenderOrderNumber({
  userOrderNumber,
}: {
  userOrderNumber: number;
}) {
  const supabase = createClientComponentClient();
  const admin = useAdminStore((state) => state.admin);
  const userID = useUserStore((state) => state.user.id);
  const userOrderNumberRef = useRef<number>(userOrderNumber);
  const ticketCircles = new Array(admin.numberForReward).fill(0);

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
    <div className="pt-12 h-1/3">
      <p className="text-white mb-4 ml-8">Süreciniz</p>
      <div className="bg-white h-full w-full grid grid-cols-4 justify-items-center items-center">
        {ticketCircles.map((item, index) => (
          <div
            key={index}
            className="w-20 h-20 rounded-full"
            style={{
              backgroundColor:
                index < userOrderNumberRef.current ? "#87A922" : "#C8AFD6",
            }}></div>
        ))}
      </div>
    </div>
  );
}
