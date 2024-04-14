import RenderBrands from "@/src/components/customer/RenderBrands";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function Brands() {
  const supabase = createServerComponentClient({ cookies });

  // @todo - auth yapmak için users ile adminsi bağlayalım
  const { data: brands, error } = await supabase
    .from("admins")
    .select(
      "id, brand_name, brand_logo_ipfs_url, number_for_reward, nft_src, contract_address, not_used_nft_src, not_used_contract_address"
    );

  if (error) {
    throw new Error("Error fetching brands");
  }

  return (
    <section className="flex justify-center pt-24">
      <RenderBrands brands={brands} />
    </section>
  );
}
