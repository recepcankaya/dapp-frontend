import { createClient } from "@/src/lib/supabase/server";
import GetNFTTotalSupply from "@/src/components/admin/GetNFTTotalSupply";
import RenderAdminStatistics from "@/src/components/admin/RenderAdminStatistics";

export default async function AdminHome() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: adminData, error: adminError } = await supabase
    .from("admins")
    .select(
      "brand_name, brand_branch, not_used_nfts, number_for_reward, number_of_orders_so_far, used_rewards, contract_address"
    )
    .eq("id", user?.id);

  if (adminError) {
    console.error(adminError);
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
      <RenderAdminStatistics adminData={adminData} />
    </div>
  );
}
