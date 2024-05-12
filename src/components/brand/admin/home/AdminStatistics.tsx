"use client";
import { type AdminHomeStatistics } from "@/src/lib/types/jsonQuery.types";
import AdminHomeCards from "./AdminHomeCards";
import AdminLineChart from "./AdminLineChart";

type AdminStatisticsProps = {
  requiredNumberForFreeRight: Brand["required_number_for_free_right"];
  weeklyTotalOrders: BrandBranch["weekly_total_orders"];
  calculatedData: AdminHomeStatistics;
};

export default function RenderAdminStatistics({
  requiredNumberForFreeRight,
  weeklyTotalOrders,
  calculatedData,
}: AdminStatisticsProps) {
  return (
    <main className="flex flex-col gap-8 p-8 md:p-12 lg:p-16 text-[#000101]">
      <AdminHomeCards
        requiredNumberForFreeRight={requiredNumberForFreeRight}
        adminData={calculatedData}
      />
      <AdminLineChart weeklyTotalOrders={weeklyTotalOrders} />
    </main>
  );
}
