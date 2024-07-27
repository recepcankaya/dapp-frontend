"use server";
import { revalidatePath } from "next/cache";

import { createClient } from "@/src/lib/supabase/server";
import getUserID from "@/src/lib/getUserID";
import decodeTurkishCharacters from "@/src/lib/convertToEnglishCharacters";

export default async function addMenuProduct(
  prevState: any,
  formData: FormData
) {
  const userID = await getUserID();
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = Number(formData.get("price"));
  const image = formData.get("image") as File;
  const category = formData.get("category") as string;
  const newCategory = formData.get("newCategory") as string;
  const branchName = formData.get("branchName") as string;
  const productNameForImage = name?.replace(/\s/g, "-");
  const turnProductToEnglishChar = decodeTurkishCharacters(productNameForImage);
  const convertToEnglish = decodeTurkishCharacters(String(branchName));

  if (!name) {
    return {
      success: false,
      message: "Ürün adını girmelisiniz.",
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

  if (!category && !newCategory) {
    return {
      success: false,
      message: "Kategori seçmelisiniz.",
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

  if (category && newCategory) {
    return {
      success: false,
      message: "Sadece bir kategori seçimi yapmalısınız.",
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

  const supabase = createClient();

  const { data: maxPosition } = await supabase
    .from("menus")
    .select("position")
    .eq("branch_id", userID)
    .order("position", { ascending: false })
    .limit(1)
    .single();

  if (image.name.toString() !== "undefined") {
    const { error: uploadingError } = await supabase.storage
      .from("menus")
      .upload(
        `${convertToEnglish}/${
          category || newCategory
        }/${turnProductToEnglishChar}`,
        image
      );

    if (uploadingError) {
      return {
        success: false,
        message:
          "Ürün resmi yüklenirken bir hata oluştu. Lütfen tekrar deneyiniz.",
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

    const { data: productURL } = supabase.storage
      .from("menus")
      .getPublicUrl(
        `${convertToEnglish}/${
          category || newCategory
        }/${turnProductToEnglishChar}`
      );

    const { data: categoryPosition } = await supabase
      .from("menus")
      .select("category_position")
      .eq("category", category)
      .single();

    const { data: menu, error } = await supabase
      .from("menus")
      .insert({
        branch_id: userID,
        category: category || newCategory,
        description: description as string,
        image_url: productURL.publicUrl as string,
        name: name as string,
        position: maxPosition ? maxPosition.position + 1 : 0,
        price: price,
      })
      .select();

    if (!error) {
      revalidatePath("/brand/[brand-home]/settings", "page");
      return {
        success: true,
        message: "Ürün menünüze başarıyla eklendi.",
        product: menu[0],
      };
    } else {
      return {
        success: false,
        message: "Ürün eklenirken bir hata oluştu. Lütfen tekrar deneyiniz.",
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
    const { data: menu, error } = await supabase
      .from("menus")
      .insert({
        branch_id: userID,
        category: category || newCategory,
        description: description as string,
        image_url: "",
        name: name as string,
        position: maxPosition ? maxPosition.position + 1 : 0,
        price: price,
      })
      .select();

    if (!error) {
      revalidatePath("/brand/[brand-home]/settings", "page");
      return {
        success: true,
        message: "Ürün menünüze başarıyla eklendi.",
        product: menu[0],
      };
    } else {
      return {
        success: false,
        message: "Ürün eklenirken bir hata oluştu. Lütfen tekrar deneyiniz.",
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
  }
}
