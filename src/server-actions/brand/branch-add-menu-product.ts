"use server";
import { createClient } from "@/src/lib/supabase/server";
import { revalidatePath } from "next/cache";
import getUserID from "@/src/lib/getUserID";
import { default as FormDataForPinata } from "form-data";
import fetch from "node-fetch";

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
  const image = formData.get("image");
  const category = formData.get("category");
  const newCategory = formData.get("newCategory");
  const branchName = formData.get("branchName");

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
    const data = new FormDataForPinata();
    data.append("file", image, {
      filename: "image.jpeg",
      contentType: "image/jpeg",
    });
    data.append(
      "pinataMetadata",
      `{\n  "name": "${name}/${branchName}.jpeg"\n}`
    );
    data.append(
      "pinataOptions",
      `{\n  "category": "${String(category) || String(newCategory)}"\n}`
    );

    const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PINATA_JWT}`,
      },
      body: data,
    });
    const resData: any = await res.json();
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
