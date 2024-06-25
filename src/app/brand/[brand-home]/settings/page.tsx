import { unstable_noStore as noStore } from "next/cache";

import BranchCampaignManagement from "@/src/components/brand/branch/settings/BranchCampaignManagement";
import BranchChangePassword from "@/src/components/brand/branch/settings/BranchChangePassword";
import BranchMenu from "@/src/components/brand/branch/settings/BranchMenu";
import getUserID from "@/src/lib/getUserID";
import { createClient } from "@/src/lib/supabase/server";

import type { CategoryProduct } from "@/src/lib/types/product.types";

export default async function Settings() {
  noStore();
  const supabase = createClient();
  const userID = await getUserID();

  const { data: menu } = await supabase
    .from("brand_branch")
    .select("menu")
    .eq("id", userID);

  if (!menu) {
    return;
  }

  const { data: campaigns } = await supabase
    .from("campaigns")
    .select("*")
    .eq("branch_id", userID);

  if (!campaigns) {
    return;
  }

  return (
    <main className="flex flex-col min-h-[100dvh]">
      <BranchChangePassword />
      <BranchCampaignManagement campaigns={campaigns} />
      <BranchMenu menu={menu[0]?.menu as CategoryProduct[]} />
    </main>
  );
}
