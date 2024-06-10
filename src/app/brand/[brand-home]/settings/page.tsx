import BranchCampaignManagement from "@/src/components/brand/branch/settings/BranchCampaignManagement";
import BranchChangePassword from "@/src/components/brand/branch/settings/BranchChangePassword";
import BranchMenu from "@/src/components/brand/branch/settings/BranchMenu";
import getUserID from "@/src/lib/getUserID";
import { createClient } from "@/src/lib/supabase/server";

import type { AdminCampaigns } from "@/src/lib/types/jsonQuery.types";
import type { CategoryProduct } from "@/src/lib/types/product.types";

export default async function Settings() {
  const supabase = createClient();
  const userID = await getUserID();

  const { data } = await supabase
    .from("brand_branch")
    .select("campaigns, menu")
    .eq("id", userID);

  if (!data) {
    return;
  }

  return (
    <main className="flex flex-col min-h-[100dvh]">
      <BranchChangePassword />
      <BranchCampaignManagement
        campaigns={(data[0].campaigns as AdminCampaigns["campaigns"]) ?? []}
      />
      <BranchMenu menu={data[0]?.menu as CategoryProduct[]} />
    </main>
  );
}
