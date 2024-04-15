"use client";
import useAdminStore from "@/src/store/adminStore";

export default function RenderOrderNumber({
  userOrderNumber,
}: {
  userOrderNumber: number;
}) {
  const admin = useAdminStore((state) => state.admin);
  const ticketCircles = new Array(admin.numberForReward).fill(0);

  return (
    <div className="pt-12 h-1/3">
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
