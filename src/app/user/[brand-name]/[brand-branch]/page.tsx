import { createClient } from "@/src/lib/supabase/server";
import CustomerHomeHeader from "@/src/components/customer/home/CustomerHomeHeader";
import CustomerHomeLinks from "@/src/components/customer/home/CustomerHomeLinks";
import CampaignCarousel from "@/src/components/customer/home/CampaignCarousel";
import RenderOrderNumber from "@/src/components/customer/home/RenderOrderNumber";
import BrandVideo from "@/src/components/customer/BrandVideo";
import { Button } from "@/src/components/ui/button";

export default async function CustomerHome({
  searchParams,
}: {
  searchParams: { adminID: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

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

  return (
    <section className="h-screen w-screen">
      <CustomerHomeHeader
        brandLogo={adminInfo && adminInfo[0].brand_logo_ipfs_url}
      />
      <CustomerHomeLinks adminId={searchParams.adminID} />
      <RenderOrderNumber
        adminInfo={adminInfo}
        userMissionNumbers={userMissionNumbers}
        userID={user?.id}
      />
      <Button
        className="mt-16 px-16 py-6 mb-8 mx-auto flex text-lg font-bold font-rosarivo rounded-xl border-2 border-lad-pink text-lad-white"
        type="submit">
        Menü
      </Button>
      <CampaignCarousel campaigns={adminInfo && adminInfo[0].campaigns} />
      {/* <BrandVideo brandVideo={adminInfo && adminInfo[0].brand_video_url} /> */}
    </section>
  );
}
