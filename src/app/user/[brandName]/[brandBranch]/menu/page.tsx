import RenderMenu from "@/src/components/customer/menu/RenderMenu";
import { createClient } from "@/src/lib/supabase/server";

import type { CategoryProduct } from "@/src/lib/types/product.types";

export default async function Menu({
  searchParams,
}: {
  searchParams: { branchID: BrandBranch["id"] };
}) {
  const supabase = createClient();

  const { data } = await supabase
    .from("brand_branch")
    .select("menu")
    .eq("id", searchParams.branchID)
    .single();

  return (
    <main>
      <RenderMenu menu={data?.menu as CategoryProduct[]} />
    </main>
  );
}
