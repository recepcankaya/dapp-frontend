"use client";
import type { BrandBranchStatistics } from "@/src/lib/types/jsonQuery.types";
import HomeCards from "./BranchHomeCards";
import LineChart from "./BranchLineChart";

export default function RenderBrandBranchStatistics({
  brandBranchData,
}: {
  brandBranchData: BrandBranchStatistics;
}) {
  return (
    <main className="flex flex-col gap-8 p-8 md:p-12 lg:p-16 text-[#000101]">
      <HomeCards brandBranchData={brandBranchData} />
      <LineChart weeklyTotalOrders={brandBranchData.weekly_total_orders} />
    </main>
  );
}
