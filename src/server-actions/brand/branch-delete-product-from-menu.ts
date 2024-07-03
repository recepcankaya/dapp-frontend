"use server";
import { createClient } from "@/src/lib/supabase/server";
import { revalidatePath } from "next/cache";
import decodeTurkishCharacters from "@/src/lib/convertToEnglishCharacters";

export default async function deleteProductFromMenu(
  prevState: any,
  formData: FormData
) {
  const productID = String(formData.get("productID"));
  const branchName = formData.get("branchName");
  const convertToEnglish = decodeTurkishCharacters(String(branchName));

  const supabase = createClient();

  const { data: product } = await supabase
    .from("menus")
    .select("*")
    .eq("id", productID)
    .single();

  const imageName = product?.image_url?.split("/").pop();

  const { error: deleteProductImage } = await supabase.storage
    .from("menus")
    .remove([`${convertToEnglish}/${product?.category}/${imageName}`]);

  if (deleteProductImage) {
    return {
      success: false,
      message:
        "Ürün resmi silinirken bir hata oluştu. Lütfen tekrar deneyiniz.",
      product: {
        branch_id: "",
        description: "",
        id: "",
        image_url: "",
        name: "",
        price: 0,
        position: 0,
        category: "",
      },
    };
  }

  const { data: deletedProduct, error } = await supabase
    .from("menus")
    .delete()
    .eq("id", productID)
    .select("*")
    .single();

  const branchID = deletedProduct?.branch_id ?? "";
  const { data: repositionedCampaigns } = await supabase
    .from("menus")
    .select("position, id")
    .eq("branch_id", branchID)
    .gt("position", deletedProduct!?.position)
    .order("position", { ascending: true });

  if (repositionedCampaigns) {
    for (let i = 0; i < repositionedCampaigns.length; i++) {
      const { data: otherPositionsUpdated } = await supabase
        .from("menus")
        .update({
          position: repositionedCampaigns[i].position - 1,
        })
        .eq("id", repositionedCampaigns[i].id);
    }
  }

  if (error) {
    return {
      success: false,
      message: "Ürün silinirken bir hata oluştu. Lütfen tekrar deneyiniz.",
      product: {
        branch_id: "",
        description: "",
        id: "",
        image_url: "",
        name: "",
        price: 0,
        position: 0,
        category: "",
      },
    };
  } else {
    revalidatePath("/brand/[brand-home]/settings", "page");
    return {
      success: true,
      message: "Ürün başarıyla silindi.",
      product: deletedProduct,
    };
  }
}
