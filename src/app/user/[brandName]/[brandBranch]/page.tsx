import { redirect } from "next/navigation";

import { createClient } from "@/src/lib/supabase/server";
import CustomerHomeHeader from "@/src/components/customer/home/CustomerHomeHeader";
import CustomerHomeLinks from "@/src/components/customer/home/CustomerHomeLinks";
import CampaignCarousel from "@/src/components/customer/home/CampaignCarousel";
import RenderTicket from "@/src/components/customer/home/RenderTicket";
import BrandVideo from "@/src/components/customer/BrandVideo";

import { AdminCampaigns } from "@/src/lib/types/jsonQuery.types";

export default async function CustomerHome({
  searchParams,
}: {
  searchParams: { brandID: BrandBranch["id"] };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const { data: totalTicketOrders, error } = await supabase
    .from("user_orders")
    .select("total_ticket_orders")
    .eq("user_id", user?.id)
    .eq("admin_id", searchParams.brandID)
    .single();

  const { data: branchInfo, error: adminError } = await supabase
    .from("brand_branch")
    .select(
      `
      required_number_for_free_right,
      campaigns,
      video_url,
      brand (
        ticket_ipfs_url,
        brand_logo_ipfs_url
      )
    `
    )
    .eq("id", searchParams.brandID)
    .single();

  if (!branchInfo) {
    redirect("/");
  }

  return (
    <section className="h-screen w-screen">
      <CustomerHomeHeader
        brandLogo={branchInfo.brand?.brand_logo_ipfs_url ?? ""}
      />
      <CustomerHomeLinks brandID={searchParams.brandID} />
      <RenderTicket
        branchInfo={branchInfo}
        totalTicketOrders={totalTicketOrders?.total_ticket_orders ?? 0}
        userID={user?.id}
      />
      <CampaignCarousel
        campaigns={(branchInfo.campaigns as AdminCampaigns["campaigns"]) ?? []}
      />
      {branchInfo.video_url ? (
        <BrandVideo brandVideo={branchInfo?.video_url} />
      ) : null}
    </section>
  );
}
