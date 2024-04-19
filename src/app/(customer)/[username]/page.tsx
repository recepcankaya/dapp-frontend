import CampaignCarousel from "@/src/components/customer/CampaignCarousel";
import CustomerHomeHeader from "@/src/components/customer/CustomerHomeHeader";
import CustomerHomeLinks from "@/src/components/customer/CustomerHomeLinks";
import { Button } from "@/src/components/ui/button";
import { createClient } from "@/src/lib/supabase/server";

export default async function CustomerHome({
  searchParams,
}: {
  searchParams: { admin: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: numberOfOrders, error } = await supabase
    .from("user_missions")
    .select("number_of_orders")
    .eq("user_id", user?.id)
    .eq("admin_id", searchParams.admin);

  const { data: adminInfo, error: adminError } = await supabase
    .from("admins")
    .select(
      "number_for_reward, number_for_reward, ticket_ipfs_url, brand_logo_ipfs_url, campaigns"
    )
    .eq("id", searchParams.admin);

  const { data: username, error: usernameError } = await supabase
    .from("users")
    .select("username")
    .eq("id", user?.id)
    .single();

  const ticketCircles = adminInfo
    ? new Array(adminInfo[0].number_for_reward).fill(0)
    : [];

  return (
    <section className="h-screen w-screen">
      <CustomerHomeHeader
        brandLogo={adminInfo && adminInfo[0].brand_logo_ipfs_url}
      />
      <CustomerHomeLinks
        username={username && username.username}
        adminId={searchParams.admin}
      />
      <div className="pt-12 h-1/2 w-full">
        <p className="text-white mb-4 ml-8">Süreciniz</p>
        <div
          className="w-full h-full grid grid-cols-4 gap-2 justify-items-start items-start bg-no-repeat bg-contain pt-4 pl-36"
          style={{
            backgroundImage: `url(${
              adminInfo &&
              adminInfo[0]?.ticket_ipfs_url?.replace(
                "ipfs://",
                "https://ipfs.io/ipfs/"
              )
            })`,
            gridTemplateColumns: "repeat(4, 1fr)",
            gridTemplateRows: "repeat(auto-fill, minmax(50px, 1fr))",
          }}>
          {ticketCircles.map((item, index) => (
            <div
              key={index}
              className={`w-12 h-12 rounded-full z-10 ${
                index >= 4 ? "mt-10" : ""
              }`}
              style={{
                background:
                  numberOfOrders && index < numberOfOrders[0]?.number_of_orders
                    ? `url(${
                        adminInfo &&
                        adminInfo[0].brand_logo_ipfs_url.replace(
                          "ipfs://",
                          "https://ipfs.io/ipfs/"
                        )
                      }) no-repeat center center`
                    : "#7B3501",
                backgroundSize: "cover",
                transform: "rotate(-45deg)",
              }}></div>
          ))}
        </div>
      </div>
      <Button
        className="px-16 py-6 mb-8 mx-auto flex text-lg font-bold font-rosarivo rounded-xl border-2 border-lad-pink text-lad-white"
        type="submit">
        Menü
      </Button>
      <CampaignCarousel campaigns={adminInfo && adminInfo[0].campaigns} />
    </section>
  );
}
