import { createClient } from "@/src/lib/supabase/server";
import RenderBrands from "@/src/components/customer/RenderBrands";

export default async function Brands() {
  const supabase = createClient();

  let { data: brands } = await supabase.from("brand_branch").select(`
      id,
      branch_name,
      coords,
      brand (
        id,
        brand_name,
        brand_logo_url
      )
    `);

  if (!brands) {
    return (
      <div className="flex justify-center items-center">
        İşletmeler bulunamadı. Lütfen tekrar deneyiniz.
      </div>
    );
  }

  brands = brands.filter(
    (brand) => brand.id !== "140222c0-b33f-4795-ba75-4ce447d03320"
  );

  return (
    <section className="flex justify-center pt-16">
      <RenderBrands brands={brands} />
    </section>
  );
}
