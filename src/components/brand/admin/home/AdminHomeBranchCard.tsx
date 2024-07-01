import React, { useState } from "react";
import { convertString } from "@/src/lib/utils";
import { AdminBrandBranchInfo } from "@/src/lib/types/jsonQuery.types";

type AdminHomeBranchCardProps = {
  brandData: AdminBrandBranchInfo;
};

export default function AdminHomeBranchCard({
  brandData,
}: AdminHomeBranchCardProps) {
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);

  const handleBranchSelect = (branchName: string) => {
    setSelectedBranch(branchName === selectedBranch ? null : branchName);
  };

  return (
    <section className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {brandData.brand_branch.map((item) => (
        <div
          key={item.id}
          className={`p-4 rounded-lg shadow-md cursor-pointer ${
            selectedBranch === item.branch_name ? "bg-gray-200" : "bg-white"
          }`}
          onClick={() => handleBranchSelect(item.branch_name)}
        >
          <p className="text-center text-gray-800 font-semibold">{item.branch_name}</p>
        </div>
      ))}
    </section>
  );
}
