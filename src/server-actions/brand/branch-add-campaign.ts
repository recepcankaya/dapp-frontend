"use server";
import { revalidatePath } from "next/cache";

import { createClient } from "@/src/lib/supabase/server";
import getUserID from "@/src/lib/getUserID";

const PINATA_JWT = process.env.PINATA_JWT;

export type FormState = {
  success: unknown;
  message: string;
};

export default async function addCampaign(prevState: any, formData: FormData) {
  const supabase = createClient();
  const userID = await getUserID();
  const campaignName = formData.get("campaignName");
  const campaignBanner = formData.get("banner") as File;
  const campaignFavourite = formData.get("favourite");

  if (!campaignName || campaignName?.length < 3) {
    return {
      success: false,
      message: "Kampanya adı en az 3 karakter olmalıdır.",
    };
  }

  if (!campaignBanner) {
    return {
      success: false,
      message: "Kampanya afişi eklemelisiniz.",
    };
  }

  const { data: info } = await supabase
    .from("brand_branch")
    .select("branch_name, brand (brand_name)")
    .eq("id", userID)
    .single();

  if (!info) {
    return {
      success: false,
      message: "Kullanıcı bulunamadı. Lütfen tekrar giriş yapınız.",
    };
  }

  let ipfsRes: string = "";
  const blob = new Blob([campaignBanner], { type: "image/jpeg" });
  const file = new File([blob], `${campaignName}/${info.branch_name}.jpeg`, {
    type: "image/jpeg",
  });
  const data = new FormData();
  data.append("file", file, "image.jpeg");
  data.append(
    "pinataMetadata",
    `{\n  "name": "${campaignName}/${info.brand?.brand_name}-campaign.jpeg"\n}`
  );
  data.append("pinataOptions", `{\n  "campaign": "true"\n}`);

  const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PINATA_JWT}`,
    },
    body: data,
  });
  const resData = await res.json();
  ipfsRes = resData.IpfsHash;

  const dbIPFS = `https://ipfs.io/ipfs/${ipfsRes}`;

  const { error } = await supabase.rpc("add_campaign", {
    row_id: userID,
    name: String(campaignName),
    image: dbIPFS,
    favourite: Boolean(campaignFavourite),
  });

  if (error) {
    return {
      success: false,
      message: "Kampanya eklenirken bir hata oluştu. Lütfen tekrar deneyiniz.",
    };
  } else {
    revalidatePath("/brand/[brand-home]/settings", "page");
    return { success: true, message: "Kampanya başarıyla eklendi." };
  }
}
