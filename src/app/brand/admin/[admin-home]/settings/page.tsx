import CampaignManagement from "@/src/components/brand/admin/settings/CampaignManagement";
import ChangePassword from "@/src/components/brand/admin/settings/ChangePassword";
import getUserID from "@/src/lib/getUserID";
import { createClient } from "@/src/lib/supabase/client";

export default async function Settings() {
  const supabase = createClient();
  const userID = await getUserID();

  return (
    <main className="flex flex-col min-h-[100dvh] bg-[#d8d0c3]">
      <ChangePassword />
      <CampaignManagement />
    </main>
  );
}
