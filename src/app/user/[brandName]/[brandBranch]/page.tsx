import { redirect } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";

import { createClient } from "@/src/lib/supabase/server";
import CustomerHomeHeader from "@/src/components/customer/home/CustomerHomeHeader";
import CustomerHomeLinks from "@/src/components/customer/home/CustomerHomeLinks";
import CampaignCarousel from "@/src/components/customer/home/CampaignCarousel";
import RenderTicket from "@/src/components/customer/home/RenderTicket";
import CampaignModal from "@/src/components/customer/home/CampaignModal";
import BrandVideo from "@/src/components/customer/BrandVideo";

export default async function CustomerHome({
  searchParams,
}: {
  searchParams: { brandID: Brand["id"]; branchID: BrandBranch["id"] };
}) {
  noStore();
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: totalTicketOrders } = await supabase
    .from("user_orders")
    .select("total_ticket_orders")
    .eq("branch_id", searchParams.branchID)
    .single();

  const { data: branchInfo } = await supabase
    .from("brand_branch")
    .select(
      `
      video_url,
      menu,
      brand (
        required_number_for_free_right,
        ticket_url,
        brand_logo_url
      )
    `
    )
    .eq("id", searchParams.branchID)
    .single();

  if (!branchInfo) {
    redirect("/user/brands");
  }

  const { data: campaigns } = await supabase
    .from("campaigns")
    .select("*")
    .eq("branch_id", searchParams.branchID);

  const favouriteCampaign = campaigns?.find(
    (campaign) => campaign.is_favourite
  );

  return (
    <section className="h-screen w-screen">
      <CustomerHomeHeader brandLogo={branchInfo.brand?.brand_logo_url ?? ""} />
      <CustomerHomeLinks
        brandID={searchParams.brandID}
        branchID={searchParams.branchID}
      />
      <CampaignModal favouriteCampaign={favouriteCampaign} />
      <RenderTicket
        brandID={searchParams.brandID}
        branchID={searchParams.branchID}
        branchInfo={branchInfo}
        totalTicketOrders={totalTicketOrders?.total_ticket_orders ?? 0}
        userID={user?.id ?? ""}
      />
      <section className="max-w-[768px] w-full aspect-video my-0 mx-auto">
        <CampaignCarousel campaigns={campaigns} />
      </section>
      {branchInfo.video_url ? (
        <BrandVideo brandVideo={branchInfo?.video_url} />
      ) : null}
    </section>
  );
}
