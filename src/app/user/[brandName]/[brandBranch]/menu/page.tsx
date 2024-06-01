import RenderMenu from "@/src/components/customer/menu/RenderMenu";
import { createClient } from "@/src/lib/supabase/server";

type Product = {
  name: string;
  price: number;
  description: string;
  image: string;
  id: string;
};

type CategoryProduct = {
  category: string;
  categoryID: string;
  products: Product[];
};

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
