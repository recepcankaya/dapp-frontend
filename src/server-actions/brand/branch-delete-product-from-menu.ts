"use server";
import { createClient } from "@/src/lib/supabase/server";
import { revalidatePath } from "next/cache";
import getUserID from "@/src/lib/getUserID";
import decodeTurkishCharacters from "@/src/lib/convertToEnglishCharacters";

export default async function deleteProductFromMenu(
  prevState: any,
  formData: FormData
) {
  const userID = await getUserID();
  const productID = String(formData.get("productID"));
  const branchName = formData.get("branchName");
  const convertToEnglish = decodeTurkishCharacters(String(branchName));

  const supabase = createClient();

  const { data: findProduct } = await supabase
    .from("menus")
    .select("image_url")
    .eq("id", productID)
    .single();

  if (!findProduct) {
    return {
      success: false,
      message: "Menü bulunamadı.",
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

  const imageName =
    findProduct?.image_url && findProduct.image_url.split("/").pop();

  const { error: deleteProductImage } = await supabase.storage
    .from("menus")
    .remove([`${convertToEnglish}/${imageName}`]);

  if (deleteProductImage) {
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
  }

  const { data: product, error } = await supabase
    .from("menus")
    .delete()
    .eq("id", productID)
    .select("*")
    .single();

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
      product: product,
    };
  }
}
