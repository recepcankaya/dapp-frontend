"use server";
import { createClient } from "@/src/lib/supabase/server";
import { revalidatePath } from "next/cache";
import getUserID from "@/src/lib/getUserID";
import decodeTurkishCharacters from "@/src/lib/convertToEnglishCharacters";
import { Product } from "@/src/lib/types/product.types";

export default async function editMenuProduct(
  prevState: any,
  formData: FormData
) {
  const userID = await getUserID();
  const productName = formData.get("name") as string;
  const branchName = formData.get("branchName");
  const description = String(formData.get("editDescription"));
  const price = Number(formData.get("editPrice"));
  const image = formData.get("editImage") as File;
  const productID = String(formData.get("productID"));
  const productNameForImage = productName?.replace(/\s/g, "-");
  const turnProductToEnglishChar = decodeTurkishCharacters(productNameForImage);
  const convertToEnglish = decodeTurkishCharacters(String(branchName));
  const supabase = createClient();

  if (image.name !== undefined) {
    const { data: findProduct } = await supabase
      .from("menus")
      .select("image_url")
      .eq("id", productID)
      .single();

    let imageUploadError = null;
    // -----------------------------------------
    if (findProduct?.image_url && findProduct.image_url.length === 0) {
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
    // -----------------------------------------
    const { error } = await supabase.from("menus").update({
      price: price,
      name: productName,
      description: description,
      image_url: productURL.publicUrl,
      id: productID,
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
      }
    } else {
      revalidatePath("/brand/[brand-home]/settings", "page");
      return {
        success: true,
        message: "Ürün başarıyla güncellendi.",
        product: {
          branch_id: userID,
          description: description,
          id: productID,
          image_url: productURL.publicUrl,
          name: productName,
          price: price,
          position: prevState.product.position as number,
          category: prevState.product.category as string,
        },
      };
    }
  } else {
    const { error } = await supabase.from("menus").update({
      branch_id: userID,
      price: price,
      name: productName,
      description: description,
      image_url: "",
      id: productID,
    });
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
        product: {
          branch_id: userID,
          description: description,
          id: productID,
          image_url: "",
          name: productName,
          price: price,
          position: prevState.product.position as number,
          category: prevState.product.category as string,
        },
      };
    }
  }
}
