"use server";
import { createClient } from "@/src/lib/supabase/server";
import { revalidatePath } from "next/cache";
import getUserID from "@/src/lib/getUserID";
import decodeTurkishCharacters from "@/src/lib/convertToEnglishCharacters";
import { CategoryProduct, Product } from "@/src/lib/types/product.types";

export default async function editMenuProduct(
  prevState: any,
  formData: FormData
) {
  const userID = await getUserID();
  const productName = formData.get("name") as string;
  const branchName = formData.get("branchName");
  const description = formData.get("editDescription");
  const price = formData.get("editPrice");
  const image = formData.get("editImage") as File;
  const productID = formData.get("productID");
  const productNameForImage = productName?.replace(/\s/g, "-");
  const turnProductToEnglishChar = decodeTurkishCharacters(productNameForImage);
  const convertToEnglish = decodeTurkishCharacters(String(branchName));
  const supabase = createClient();

  if (image.name !== undefined) {
    const { data: products } = await supabase
      .from("brand_branch")
      .select("menu")
      .eq("id", userID)
      .single();

    const findProduct: Product | undefined = (
      products?.menu as CategoryProduct[]
    )?.reduce((prev: Product | undefined, cat) => {
      return (
        prev ||
        cat.products.find(
          (product: Product) => Number(product.id) === Number(productID)
        )
      );
    }, undefined);

    let imageUploadError = null;

    if (findProduct?.image.length === 0) {
      const uploadingResult = await supabase.storage
        .from("menus")
        .upload(`${convertToEnglish}/${turnProductToEnglishChar}`, image);
      imageUploadError = uploadingResult.error;
    } else {
      const updatingResult = await supabase.storage
        .from("menus")
        .update(`${convertToEnglish}/${turnProductToEnglishChar}`, image);
      imageUploadError = updatingResult.error;
    }

    const { data: productURL } = supabase.storage
      .from("menus")
      .getPublicUrl(`${convertToEnglish}/${turnProductToEnglishChar}`);

    const { error } = await supabase.rpc("edit_product_from_menu", {
      p_new_price: `${price} TL`,
      p_new_description: String(description),
      p_product_id: Number(productID),
      p_brand_branch_id: userID,
      p_new_image: productURL.publicUrl,
    });

    if (error || imageUploadError) {
      if (
        imageUploadError?.message.includes(
          "The requested resource isn't a valid image for"
        )
      ) {
        return {
          success: false,
          message: "Lütfen geçerli bir resim dosyası yükleyiniz.",
        };
      } else {
        return {
          success: false,
          message:
            "Ürün güncellenirken bir hata oluştu. Lütfen tekrar deneyiniz.",
        };
      }
    } else {
      revalidatePath("/brand/[brand-home]/settings", "page");
      return { success: true, message: "Ürün başarıyla güncellendi." };
    }
  } else {
    const { error } = await supabase.rpc("edit_product_from_menu", {
      p_new_price: `${price} TL`,
      p_new_description: String(description),
      p_product_id: Number(productID),
      p_brand_branch_id: userID,
      p_new_image: "",
    });
    if (error) {
      return {
        success: false,
        message:
          "Ürün güncellenirken bir hata oluştu. Lütfen tekrar deneyiniz.",
      };
    } else {
      revalidatePath("/brand/[brand-home]/settings", "page");
      return { success: true, message: "Ürün başarıyla güncellendi." };
    }
  }
}
