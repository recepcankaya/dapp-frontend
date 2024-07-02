import type { AdminBrandBranchInfo } from "@/src/lib/types/jsonQuery.types";

type AdminHomeBranchCardProps = {
  brandData: AdminBrandBranchInfo;
  selectedBranch: string | null; // Assuming this is where the selected branch is stored
  onBranchSelect: (branchName: string) => void;
};

export default function AdminHomeBranchCard({
  brandData,
  selectedBranch,
  onBranchSelect,
}: AdminHomeBranchCardProps) {
  return (
    <section className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      <ul>
        {brandData.brand_branch.map((item) => (
          <li
            key={item.id}
            className={`p-4 rounded-lg shadow-md cursor-pointer ${
              selectedBranch === item.branch_name ? "bg-gray-200" : "bg-white"
            }`}
            onClick={() => {
              onBranchSelect(item.branch_name);
            }}>
            <p className="text-center text-gray-800 font-semibold">
              {item.branch_name}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
