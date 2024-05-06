"use client";
import type { BrandBranchStatistics } from "@/src/lib/types/jsonQuery.types";
import HomeCards from "./HomeCards";
import LineChart from "./LineChart";

export default function RenderAdminStatistics({
  brandBranchData,
}: {
  brandBranchData: BrandBranchStatistics;
}) {
  return (
    <main className="flex flex-col gap-8 p-8 md:p-12 lg:p-16 text-[#000101]">
      <HomeCards brandBranchData={brandBranchData} />
      <LineChart totalOrders={brandBranchData.total_orders} />
    </main>
  );
}
