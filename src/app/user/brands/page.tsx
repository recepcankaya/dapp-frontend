import { createClient } from "@/src/lib/supabase/server";
import { ToastContainer, toast } from "react-toastify";

import RenderBrands from "@/src/components/customer/RenderBrands";

export default async function Brands() {
  const supabase = createClient();

  const { data: brands, error } = await supabase
    .from("admins")
    .select(
      "id, brand_name, brand_branch, brand_logo_ipfs_url, ticket_ipfs_url, number_for_reward, nft_src, contract_address, coords, free_right_image_url, collection_metadata"
    );

  if (error) {
    toast.error(
      "Markaları yüklerken bir hata oluştu. Lütfen tekrar dener misiniz?",
      {
        position: "top-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      }
    );
  }

  return (
    <section className="flex justify-center pt-16">
      <ToastContainer />
      <RenderBrands brands={brands || []} />
    </section>
  );
}
