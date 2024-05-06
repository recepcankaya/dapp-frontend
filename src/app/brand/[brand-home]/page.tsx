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
      required_number_for_free_right, 
      total_unused_free_rights, 
      brand_branch(
        branch_name, 
        total_orders, 
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

  const dataObject = {
    branch_name: data.brand_branch[0].branch_name,
    total_orders: data.brand_branch[0].total_orders,
    total_used_free_rights: data.brand_branch[0].total_used_free_rights,
    daily_total_orders: data.brand_branch[0].daily_total_orders,
    daily_total_used_free_rights:
      data.brand_branch[0].daily_total_used_free_rights,
    monthly_total_orders: data.brand_branch[0].monthly_total_orders,
    required_number_for_free_right: data.required_number_for_free_right,
    total_unused_free_rights: data.total_unused_free_rights,
  };

  return (
    <div className="bg-[#d8d0c3]">
      <AdminHomeHeader
        brandName={data.brand_name}
        brandBranch={data.brand_branch[0].branch_name}
        brandLogo={data.brand_logo_ipfs_url}
      />
      <RenderAdminStatistics
        brandBranchData={dataObject as BrandBranchStatistics}
      />
    </div>
  );
}
