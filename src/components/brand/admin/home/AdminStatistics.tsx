"use client";
import {AdminBrandBranchInfo, type AdminHomeStatistics } from "@/src/lib/types/jsonQuery.types";
import AdminHomeCards from "./AdminHomeCards";
import AdminLineChart from "./AdminLineChart";
import AdminHomeBranchCard from "./AdminHomeBranchCard";

type AdminStatisticsProps = {
  brandData: AdminBrandBranchInfo,
  requiredNumberForFreeRight: Brand["required_number_for_free_right"];
  weeklyTotalOrders: BrandBranch["weekly_total_orders"];
  calculatedData: AdminHomeStatistics;
};

export default function RenderAdminStatistics({
  brandData,
  requiredNumberForFreeRight,
  weeklyTotalOrders,
  calculatedData,
}: AdminStatisticsProps) {
  return (
    <main className="flex flex-col gap-8 p-8 md:p-12 lg:p-16 text-[#000101]">
      <AdminHomeBranchCard brandData = {brandData}/>
      <AdminHomeCards
        requiredNumberForFreeRight={requiredNumberForFreeRight}
        adminData={calculatedData}
      />
      <AdminLineChart weeklyTotalOrders={weeklyTotalOrders} />
    </main>
  );
}
