import { redirect } from "next/navigation";

import { createClient } from "@/src/lib/supabase/server";
import CustomerHomeHeader from "@/src/components/customer/home/CustomerHomeHeader";
import CustomerHomeLinks from "@/src/components/customer/home/CustomerHomeLinks";
import CampaignCarousel from "@/src/components/customer/home/CampaignCarousel";
import RenderTicket from "@/src/components/customer/home/RenderTicket";
import BrandVideo from "@/src/components/customer/BrandVideo";
import { Button } from "@/src/components/ui/button";
import { AdminCampaigns } from "@/src/lib/types/jsonQuery.types";

export default async function CustomerHome({
  searchParams,
}: {
  searchParams: { adminID: Admin["id"] };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const { data: userMissionNumbers, error } = await supabase
    .from("user_missions")
    .select("number_of_orders")
    .eq("user_id", user?.id)
    .eq("admin_id", searchParams.adminID);

  const { data: adminInfo, error: adminError } = await supabase
    .from("admins")
    .select(
      "number_for_reward, number_for_reward, ticket_ipfs_url, brand_logo_ipfs_url, campaigns, brand_video_url"
    )
    .eq("id", searchParams.adminID);

  if (!adminInfo) {
    redirect("/");
  }

  return (
    <section className="h-screen w-screen">
      <CustomerHomeHeader brandLogo={adminInfo[0].brand_logo_ipfs_url ?? ""} />
      <CustomerHomeLinks adminId={searchParams.adminID} />
      <RenderTicket
        adminInfo={adminInfo}
        userMissionNumbers={userMissionNumbers}
        userID={user?.id}
      />
      <CampaignCarousel
        campaigns={
          (adminInfo[0].campaigns as AdminCampaigns["campaigns"]) ?? []
        }
      />
      {/* <BrandVideo brandVideo={adminInfo && adminInfo[0].brand_video_url} /> */}
    </section>
  );
}
