"use server";
import { createClient } from "@/src/lib/supabase/server";
import { revalidatePath } from "next/cache";
import getUserID from "@/src/lib/getUserID";

export type FormState = {
  success: unknown;
  message: string;
};

export default async function editMenuProduct(
  prevState: any,
  formData: FormData
) {
  const userID = await getUserID();
  const description = formData.get("editDescription");
  const price = formData.get("editPrice");
  const productID = formData.get("productID");

  const supabase = createClient();
  const { data, error } = await supabase.rpc("edit_product_from_menu", {
    p_new_description: String(description),
    p_new_price: `${price} TL`,
    p_brand_branch_id: userID,
    p_product_id: Number(productID),
  });

  if (error) {
    return {
      success: false,
      message: "Ürün güncellenirken bir hata oluştu. Lütfen tekrar deneyiniz.",
    };
  } else {
    revalidatePath("/brand/[brand-home]/settings", "page");
    return { success: true, message: "Ürün başarıyla güncellendi." };
  }
}
