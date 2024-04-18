import RenderBrands from "@/src/components/customer/RenderBrands";
import { createClient } from "@/src/lib/supabase/server";

export default async function Brands() {
  const supabase = createClient();

  // @todo - auth yapmak için users ile adminsi bağlayalım
  const { data: brands, error } = await supabase
    .from("admins")
    .select(
      "id, brand_name, brand_logo_ipfs_url, ticket_ipfs_url, number_for_reward, nft_src, contract_address, coords"
    );

  if (error) {
    throw new Error("Error fetching brands");
  }

  return (
    <section className="flex justify-center pt-16">
      <RenderBrands brands={brands} />
    </section>
  );
}
