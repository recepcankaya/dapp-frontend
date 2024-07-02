"use client";
import { useEffect, useState } from "react";
import { AdminBrandBranchInfo, AdminHomeStatistics } from "@/src/lib/types/jsonQuery.types";
import AdminHomeCards from "./AdminHomeCards";
import AdminLineChart from "./AdminLineChart";
import AdminHomeBranchCard from "./AdminHomeBranchCard";
import { usePathname, useRouter } from "next/navigation";
import { convertString } from "@/src/lib/utils";

type AdminStatisticsProps = {
  brandData: AdminBrandBranchInfo;
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
  const [branchCalculatedData, setBranchCalculatedData] = useState(calculatedData);
  const [branchWeeklyTotalOrder, setBranchWeeklytotalOrder] = useState(weeklyTotalOrders);
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!selectedBranch) {
      router.push(pathname, undefined); 
    }
  }, [selectedBranch, pathname, router]);


  const calculateWeeklyTotalOrders = (weeklyTotalOrders: {
    [key: string]: number;
  }) => {
    const result: { [key: string]: number } = {};

    Object.keys(weeklyTotalOrders).forEach((day) => {
      const value = weeklyTotalOrders[day];
      if (typeof value === "number") {
        result[day] = value;
      }
    });

    return result;
  };

  const handleBranchSelect = (branchName: string | null) => {
    if (branchName === selectedBranch) {
      setSelectedBranch(null);
      setBranchCalculatedData(calculatedData);
      setBranchWeeklytotalOrder(weeklyTotalOrders);
      router.push(`${pathname}`, undefined);     
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

          setBranchWeeklytotalOrder(
            calculateWeeklyTotalOrders(
              selectedBranchData.weekly_total_orders as {
                [key: string]: number;
              }
            )
          );
          setBranchCalculatedData(updatedCalculatedData);
          router.push(`${pathname}?branch=${convertString(branchName)}`, undefined);        }
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
      <AdminLineChart weeklyTotalOrders={branchWeeklyTotalOrder} />
    </main>
  );
}
