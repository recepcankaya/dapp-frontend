import { createClient } from "@/src/lib/supabase/server";
import RenderBrands from "@/src/components/customer/RenderBrands";

export default async function Brands() {
  const supabase = createClient();

  const { data: brands, error } = await supabase.from("brand").select(`
      id,
      brand_name,
      brand_logo_ipfs_url,
      brand_branch (
        id,
        branch_name,
        coords
      )  
    `);

  return (
    <section className="flex justify-center pt-16">
      <RenderBrands brands={brands || []} />
    </section>
  );
}
