import { unstable_noStore as noStore } from "next/cache";

import BranchCampaignManagement from "@/src/components/brand/branch/settings/BranchCampaignManagement";
import BranchChangePassword from "@/src/components/brand/branch/settings/BranchChangePassword";
import BranchMenu from "@/src/components/brand/branch/settings/BranchMenu";
import getUserID from "@/src/lib/getUserID";
import { createClient } from "@/src/lib/supabase/server";

export default async function Settings() {
  noStore();
  const supabase = createClient();
  const userID = await getUserID();

  const { data: menu } = await supabase
    .from("menus")
    .select("*")
    .eq("branch_id", userID)
    .order("position", { ascending: true });

  // Refactor edilecek yeni veritabanı sisteminde
  if (!menu) return null;

  const { data: campaigns } = await supabase
    .from("campaigns")
    .select("*")
    .eq("branch_id", userID)
    .order("position", { ascending: true });

  return (
    <main className="flex flex-col min-h-[100dvh]">
      <BranchChangePassword />
      <BranchCampaignManagement campaigns={campaigns} branchID={userID} />
      <BranchMenu menus={menu} branchID={userID} />
    </main>
  );
}
