"use server";
import { createClient } from "@/src/lib/supabase/server";
import { revalidatePath } from "next/cache";
import getUserID from "@/src/lib/getUserID";
import decodeTurkishCharacters from "@/src/lib/convertToEnglishCharacters";

export default async function addMenuProduct(
  prevState: any,
  formData: FormData
) {
  const userID = await getUserID();
  const name = formData.get("name") as String;
  const description = formData.get("description");
  const price = formData.get("price");
  const image = formData.get("image") as File;
  const category = formData.get("category");
  const newCategory = formData.get("newCategory");
  const branchName = formData.get("branchName");
  const productNameForImage = name?.replace(/\s/g, "-");
  const turnProductToEnglishChar = decodeTurkishCharacters(productNameForImage);
  const convertToEnglish = decodeTurkishCharacters(String(branchName));

  if (!name) {
    return {
      success: false,
      message: "Ürün adını girmelisiniz.",
    };
  }

  if (!category && !newCategory) {
    return {
      success: false,
      message: "Kategori seçmelisiniz.",
    };
  }

  if (category && newCategory) {
    return {
      success: false,
      message: "Sadece bir kategori seçimi yapmalısınız.",
    };
  }

  const supabase = createClient();

  if (image.name !== undefined) {
    const { error: uploadingError } = await supabase.storage
      .from("menus")
      .upload(`${convertToEnglish}/${turnProductToEnglishChar}`, image);

    if (uploadingError) {
      return {
        success: false,
        message: "Ürün yüklenirken bir hata oluştu. Lütfen tekrar deneyiniz.",
      };
    }

    const { data: productURL } = supabase.storage
      .from("menus")
      .getPublicUrl(`${convertToEnglish}/${turnProductToEnglishChar}`);

    const { error } = await supabase.rpc("add_product_to_menu", {
      p_product_name: String(name),
      p_description: String(description),
      p_price: price ? `${price} TL` : "0",
      p_product_image: productURL.publicUrl,
      p_category: String(category) || String(newCategory),
      p_brand_branch_id: userID,
    });

    if (!error) {
      revalidatePath("/brand/[brand-home]/settings", "page");
      return { success: true, message: "Ürün menünüze başarıyla eklendi." };
    } else {
      return {
        success: false,
        message: "Ürün eklenirken bir hata oluştu. Lütfen tekrar deneyiniz.",
      };
    }
  } else {
    const { error } = await supabase.rpc("add_product_to_menu", {
      p_product_name: String(name),
      p_description: String(description),
      p_price: price ? `${price} TL` : "0",
      p_product_image: "",
      p_category: String(category) || String(newCategory),
      p_brand_branch_id: userID,
    });
    if (!error) {
      revalidatePath("/brand/[brand-home]/settings", "page");
      return { success: true, message: "Ürün menünüze başarıyla eklendi." };
    } else {
      return {
        success: false,
        message: "Ürün eklenirken bir hata oluştu. Lütfen tekrar deneyiniz.",
      };
    }
  }
}
