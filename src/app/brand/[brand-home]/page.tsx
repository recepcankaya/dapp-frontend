import { createClient } from "@/src/lib/supabase/server";
import GetNFTTotalSupply from "@/src/components/admin/home/GetNFTTotalSupply";
import RenderAdminStatistics from "@/src/components/admin/home/AdminStatistics";
import { redirect } from "next/navigation";
import type { BrandBranchStatistics } from "@/src/lib/types/jsonQuery.types";
import AdminHomeHeader from "@/src/components/admin/home/AdminHomeHeader";

export default async function AdminHome() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/brand/brand-login");
  }

  const { data } = await supabase
    .from("brand")
    .select(
      `brand_name, 
      brand_logo_ipfs_url, 
      brand_branch(
        branch_name, 
        required_number_for_free_right, 
        total_orders, 
        total_unused_free_rigths, 
        total_used_free_rights, 
        daily_total_orders, 
        daily_total_used_free_rights, 
        monthly_total_orders
      )`
    )
    .eq("id", user?.id)
    .single();

  if (!data) {
    return <div>Veri bulunamadı. Lütfen tekrar deneyiniz.</div>;
  }

  return (
    <div className="bg-[#d8d0c3]">
      <AdminHomeHeader
        brandName={data.brand_name}
        brandBranch={data.brand_branch[0].branch_name}
        brandLogo={data.brand_logo_ipfs_url}
      />
      <RenderAdminStatistics
        brandBranchData={data.brand_branch[0] as BrandBranchStatistics}
      />
    </div>
  );
}
