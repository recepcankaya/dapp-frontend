import { createClient } from "@/src/lib/supabase/server";
import RenderBrandBranchStatistics from "@/src/components/brand/branch/home/RenderBrandBranchStatistics";
import BranchHomeHeader from "@/src/components/brand/branch/home/BranchHomeHeader";
import getUserID from "@/src/lib/getUserID";

import { type BrandBranchStatistics } from "@/src/lib/types/jsonQuery.types";

export default async function BranchHome() {
  const supabase = createClient();
  const userID = await getUserID();

  const { data } = await supabase
    .from("brand_branch")
    .select(
      ` branch_name,
        total_orders,
        total_used_free_rights,
        daily_total_orders,
        daily_total_used_free_rights,
        monthly_total_orders,
        weekly_total_orders,
        total_unused_free_rights,
        brand (
          brand_name,
          brand_logo_url,
          required_number_for_free_right
    )
    `
    )
    .eq("id", userID)
    .single();

  if (!data || !data.brand) {
    return <div>Veri bulunamadı. Lütfen tekrar deneyiniz.</div>;
  }

  const dataObject = {
    branch_name: data.branch_name,
    total_orders: data.total_orders,
    total_used_free_rights: data.total_used_free_rights,
    total_unused_free_rights: data.total_unused_free_rights,
    daily_total_orders: data.daily_total_orders,
    daily_total_used_free_rights: data.daily_total_used_free_rights,
    weekly_total_orders: data.weekly_total_orders,
    monthly_total_orders: data.monthly_total_orders,
    required_number_for_free_right: data.brand.required_number_for_free_right,
  };

  return (
    <div>
      <BranchHomeHeader
        brandName={String(data.brand?.brand_name)}
        brandBranch={data.branch_name}
        brandLogo={String(data.brand.brand_logo_url)}
      />
      <RenderBrandBranchStatistics
        brandBranchData={dataObject as BrandBranchStatistics}
      />
    </div>
  );
}
