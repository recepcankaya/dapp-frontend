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
      <section className="container mx-auto px-4 md:px-6 py-8 bg-[#D9D9D9] text-black mt-24">
        <h2 className="text-2xl font-bold underline underline-offset-4 absolute left-1/2 transform -translate-x-1/2">
          Kampanya Yönetimi
        </h2>
        {campaigns ? (
          <BranchCampaignManagement campaigns={campaigns} branchID={userID} />
        ) : (
          <p className="mt-12 md:mt-0">Aktif kampanyanız bulunmamaktadır.</p>
        )}
      </section>
      <BranchMenu menu={menu[0]?.menu as CategoryProduct[]} />
    </main>
  );
}
