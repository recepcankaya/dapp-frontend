import BranchCampaignManagement from "@/src/components/brand/branch/settings/BranchCampaignManagement";
import BranchChangePassword from "@/src/components/brand/branch/settings/BranchChangePassword";
import getUserID from "@/src/lib/getUserID";
import { createClient } from "@/src/lib/supabase/server";
import { AdminCampaigns } from "@/src/lib/types/jsonQuery.types";

export default async function Settings() {
  const supabase = createClient();
  const userID = await getUserID();

  const { data } = await supabase
    .from("brand_branch")
    .select("campaigns")
    .eq("id", userID);

  if (!data) {
    return;
  }

  return (
    <main className="flex flex-col min-h-[100dvh] bg-[#d8d0c3]">
      <BranchChangePassword />
      <BranchCampaignManagement
        campaigns={(data[0].campaigns as AdminCampaigns["campaigns"]) ?? []}
      />
    </main>
  );
}
