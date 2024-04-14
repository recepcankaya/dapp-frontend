"use client";

import useUserStore from "@/src/store/userStore";

import useAdminStore from "@/src/store/adminStore";
import { useRouter } from "next/navigation";

export default function RenderOrderNumber({
  userOrderNumber,
}: {
  userOrderNumber: number;
}) {
  const admin = useAdminStore((state) => state.admin);
  const username = useUserStore((state) => state.user.username);
  const ticketCircles = new Array(admin.numberForReward).fill(0);
  const router = useRouter();

  return (
    <div className="pt-12 h-1/3">
      <h2
        onClick={() => router.push(`/${username}/profile`)}
        className="text-right text-lg mr-8 underline decoration-2 underline-offset-2">
        Profil
      </h2>
      <p className="text-white mb-4 ml-8">Süreciniz</p>
      <div className="bg-white h-full w-full grid grid-cols-4 justify-items-center items-center">
        {ticketCircles.map((item, index) => (
          <div
            key={index}
            className="w-20 h-20 rounded-full"
            style={{
              backgroundColor: index < userOrderNumber ? "#87A922" : "#C8AFD6",
            }}></div>
        ))}
      </div>
    </div>
  );
}
