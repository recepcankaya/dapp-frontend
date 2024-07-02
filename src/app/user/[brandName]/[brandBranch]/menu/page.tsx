import RenderMenu from "@/src/components/customer/menu/RenderMenu";
import { createClient } from "@/src/lib/supabase/server";

export default async function Menu({
  searchParams,
}: {
  searchParams: { branchID: BrandBranch["id"] };
}) {
  const supabase = createClient();

  const { data: menu } = await supabase
    .from("menus")
    .select("*")
    .eq("branch_id", searchParams.branchID)
    .order("position", { ascending: true });

  return (
    <main>
      <RenderMenu menus={menu as Menus[]} />
    </main>
  );
}
