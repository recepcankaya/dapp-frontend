import { createClient } from "@/src/lib/supabase/server";
import GetNFTTotalSupply from "@/src/components/admin/home/GetNFTTotalSupply";
import RenderAdminStatistics from "@/src/components/admin/home/AdminStatistics";
import { redirect } from "next/navigation";
import type { AdminStatistics } from "@/src/lib/types/jsonQuery.types";
import AdminHomeHeader from "@/src/components/admin/home/AdminHomeHeader";

export default async function AdminHome() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/admin-login");
  }

  const { data: adminData, error: adminError } = await supabase
    .from("admins")
    .select(
      "brand_name, brand_branch, brand_logo_ipfs_url, not_used_nfts, number_for_reward, number_of_orders_so_far, admin_used_rewards, contract_address"
    )
    .eq("id", user?.id);

  if (!adminData) {
    return <div>Veri bulunamadı. Lütfen tekrar deneyiniz.</div>;
  }

  return (
    <div className="bg-[#d8d0c3]">
      <AdminHomeHeader
        brandName={adminData[0].brand_name}
        brandBranch={adminData[0].brand_branch}
        brandLogo={adminData[0].brand_logo_ipfs_url}
      />
      <RenderAdminStatistics adminData={adminData as AdminStatistics[]} />
    </div>
  );
}
