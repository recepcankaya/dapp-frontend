"use server";
import { revalidatePath } from "next/cache";

import { createClient } from "@/src/lib/supabase/server";
import getUserID from "@/src/lib/getUserID";
import decodeTurkishCharacters from "@/src/lib/convertToEnglishCharacters";

export default async function editMenuProduct(
  prevState: any,
  formData: FormData
) {
  const productName = formData.get("name") as string;
  const branchName = formData.get("branchName");
  const description = formData.get("editDescription");
  const price = formData.get("editPrice");
  const image = formData.get("editImage") as File;
  const productID = String(formData.get("productID"));
  const productNameForImage = productName?.replace(/\s/g, "-");
  const turnProductToEnglishChar = decodeTurkishCharacters(productNameForImage);
  const convertToEnglish = decodeTurkishCharacters(String(branchName));
  const supabase = createClient();

  const { data: findProduct } = await supabase
    .from("menus")
    .select()
    .eq("id", productID)
    .single();

  if (image.name.toString() !== "undefined") {
    let imageUploadError = null;
    // -----------------------------------------
    if (!findProduct?.image_url) {
      const uploadingResult = await supabase.storage
        .from("menus")
        .upload(
          `${convertToEnglish}/${findProduct?.category}/${turnProductToEnglishChar}`,
          image
        );
      imageUploadError = uploadingResult.error;
    } else {
      const updatingResult = await supabase.storage
        .from("menus")
        .update(
          `${convertToEnglish}/${findProduct.category}/${turnProductToEnglishChar}`,
          image
        );
      imageUploadError = updatingResult.error;
    }

    const { data: productURL } = supabase.storage
      .from("menus")
      .getPublicUrl(
        `${convertToEnglish}/${findProduct?.category}/${turnProductToEnglishChar}`
      );
    // -----------------------------------------
    const { data: updatedProduct, error } = await supabase
      .from("menus")
      .update({
        price: Number(price) ?? findProduct?.price,
        description: String(description) ?? findProduct?.description,
        image_url: productURL.publicUrl,
      })
      .eq("id", productID)
      .select()
      .single();

    if (error || imageUploadError) {
      if (
        imageUploadError?.message.includes(
          "The requested resource isn't a valid image for"
        )
      ) {
        return {
          success: false,
          message: "Lütfen geçerli bir resim dosyası yükleyiniz.",
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
        return {
          success: false,
          message:
            "Ürün resmi güncellenirken bir hata oluştu. Lütfen tekrar deneyiniz.",
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
    } else {
      revalidatePath("/brand/[brand-home]/settings", "page");
      return {
        success: true,
        message: "Ürün başarıyla güncellendi.",
        product: updatedProduct,
      };
    }
  } else {
    const { data: updatedProduct, error } = await supabase
      .from("menus")
      .update({
        price: Number(price) ?? findProduct?.price,
        description: String(description) ?? findProduct?.description,
      })
      .eq("id", productID)
      .select()
      .single();

    if (error) {
      return {
        success: false,
        message:
          "Ürün güncellenirken bir hata oluştu. Lütfen tekrar deneyiniz.",
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
        message: "Ürün başarıyla güncellendi.",
        product: updatedProduct,
      };
    }
  }
}
