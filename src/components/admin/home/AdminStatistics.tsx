"use client";
import type { AdminStatistics } from "@/src/lib/types/jsonQuery.types";
import HomeCards from "./HomeCards";
import LineChart from "./LineChart";

export default function RenderAdminStatistics({
  adminData,
}: {
  adminData: AdminStatistics[];
}) {
  return (
    <main className="flex flex-col gap-8 p-8 md:p-12 lg:p-16 text-[#000101]">
      <HomeCards adminData={adminData} />
      <LineChart numberOfOrders={adminData[0].number_of_orders_so_far} />
    </main>
  );
}
