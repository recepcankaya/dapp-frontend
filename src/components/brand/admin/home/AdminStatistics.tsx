"use client";
import React, { useState } from "react";
import {
  AdminBrandBranchInfo,
  AdminHomeStatistics,
} from "@/src/lib/types/jsonQuery.types";
import AdminHomeCards from "./AdminHomeCards";
import AdminLineChart from "./AdminLineChart";
import AdminHomeBranchCard from "./AdminHomeBranchCard";

type AdminStatisticsProps = {
  brandData: AdminBrandBranchInfo;
  requiredNumberForFreeRight: number;
  weeklyTotalOrders: any;
  calculatedData: AdminHomeStatistics;
};

export default function RenderAdminStatistics({
  brandData,
  requiredNumberForFreeRight,
  weeklyTotalOrders,
  calculatedData,
}: AdminStatisticsProps) {
  const [branchCalculatedData, setBranchCalculatedData] = useState(calculatedData);
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);

  const handleBranchSelect = (branchName: string | null) => {
    if (branchName === selectedBranch) {
      setSelectedBranch(null);
      setBranchCalculatedData(calculatedData);
    } else {
      setSelectedBranch(branchName);
      if (branchName) {
        const selectedBranchData = brandData.brand_branch.find(
          (branch) => branch.branch_name === branchName
        );
        if (selectedBranchData) {
          const updatedCalculatedData = {
            total_orders: selectedBranchData.total_orders,
            total_used_free_rights: selectedBranchData.total_used_free_rights,
            total_unused_free_rights:
              selectedBranchData.total_unused_free_rights,
            daily_total_orders: selectedBranchData.daily_total_orders,
            daily_total_used_free_rights:
              selectedBranchData.daily_total_used_free_rights,
            monthly_total_orders: selectedBranchData.monthly_total_orders,
          };

          setBranchCalculatedData(updatedCalculatedData);
        }
      }
    }
  };

  return (
    <main className="flex flex-col gap-8 p-8 md:p-12 lg:p-16 text-[#000101]">
      <AdminHomeBranchCard
        brandData={brandData}
        onBranchSelect={handleBranchSelect}
        selectedBranch={selectedBranch}
      />
      <AdminHomeCards
        requiredNumberForFreeRight={requiredNumberForFreeRight}
        adminData={branchCalculatedData}
        selectedBranch={selectedBranch}
      />
      <AdminLineChart weeklyTotalOrders={weeklyTotalOrders} />
    </main>
  );
}
