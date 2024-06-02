"use server";
import { createClient } from "@/src/lib/supabase/server";
import { revalidatePath } from "next/cache";
import getUserID from "@/src/lib/getUserID";

const PINATA_JWT = process.env.PINATA_JWT;

export type FormState = {
  success: unknown;
  message: string;
};

export default async function addMenuProduct(
  prevState: any,
  formData: FormData
) {
  const userID = await getUserID();
  const name = formData.get("name");
  const description = formData.get("description");
  const price = formData.get("price");
  const image = formData.get("image") as File;
  const category = formData.get("category");
  const newCategory = formData.get("newCategory");
  const branchHome = formData.get("branchHome");

  if (!name) {
    return {
      success: false,
      message: "Ürün adını girmelisiniz.",
    };
  }

  if (!price) {
    return {
      success: false,
      message: "Ürün fiyatını girmelisiniz.",
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

  let ipfsRes: string = "";
  if (image) {
    const blob = new Blob([image], { type: "image/jpeg" });
    const file = new File([blob], `${name}/${branchHome}.jpeg`, {
      type: "image/jpeg",
    });
    const data = new FormData();
    data.append("file", file, "image.jpeg");
    const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PINATA_JWT}`,
      },
      body: data,
    });
    const resData = await res.json();
    ipfsRes = resData.IpfsHash;
  }

  const dbIPFS = `https://ipfs.io/ipfs/${ipfsRes}`;

  const supabase = createClient();
  const { error } = await supabase.rpc("add_product_to_menu", {
    p_product_name: String(name),
    p_description: String(description),
    p_price: `${price} TL`,
    p_product_image: dbIPFS,
    p_category: String(category) || String(newCategory),
    p_brand_branch_id: userID,
  });

  if (error) {
    return {
      success: false,
      message: "Ürün eklenirken bir hata oluştu. Lütfen tekrar deneyiniz.",
    };
  } else {
    revalidatePath("/brand/[brand-home]/settings", "page");
    return { success: true, message: "Ürün menünüze başarıyla eklendi." };
  }
}
