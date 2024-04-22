import { createClient } from "@/src/lib/supabase/server";
import CustomerHomeHeader from "@/src/components/customer/CustomerHomeHeader";
import CustomerHomeLinks from "@/src/components/customer/CustomerHomeLinks";
import CampaignCarousel from "@/src/components/customer/CampaignCarousel";
import RenderOrderNumber from "@/src/components/customer/RenderOrderNumber";
import { Button } from "@/src/components/ui/button";

export default async function CustomerHome({
  searchParams,
}: {
  searchParams: { admin: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: userMissionNumbers, error } = await supabase
    .from("user_missions")
    .select("number_of_orders, number_of_free_rights")
    .eq("user_id", user?.id)
    .eq("admin_id", searchParams.admin);

  const { data: adminInfo, error: adminError } = await supabase
    .from("admins")
    .select(
      "number_for_reward, number_for_reward, ticket_ipfs_url, brand_logo_ipfs_url, campaigns, contract_address, collection_metadata"
    )
    .eq("id", searchParams.admin);

  const { data: username, error: usernameError } = await supabase
    .from("users")
    .select("username")
    .eq("id", user?.id)
    .single();

  return (
    <section className="h-screen w-screen">
      <CustomerHomeHeader
        brandLogo={adminInfo && adminInfo[0].brand_logo_ipfs_url}
      />
      <CustomerHomeLinks
        username={username && username.username}
        adminId={searchParams.admin}
      />
      <RenderOrderNumber
        adminInfo={adminInfo}
        userMissionNumbers={userMissionNumbers}
        userID={user?.id}
      />
      <Button
        className="px-16 py-6 mb-8 mx-auto flex text-lg font-bold font-rosarivo rounded-xl border-2 border-lad-pink text-lad-white"
        type="submit">
        Menü
      </Button>
      <CampaignCarousel campaigns={adminInfo && adminInfo[0].campaigns} />
    </section>
  );
}
