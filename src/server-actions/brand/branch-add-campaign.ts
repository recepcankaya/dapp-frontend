"use server";
import { revalidatePath } from "next/cache";

import { createClient } from "@/src/lib/supabase/server";
import getUserID from "@/src/lib/getUserID";
import { AdminCampaigns, Campaign } from "@/src/lib/types/jsonQuery.types";
import { ThirdwebStorage } from "@thirdweb-dev/storage";

export type FormState = {
  success: unknown;
  message: string;
};

const storage = new ThirdwebStorage({
  secretKey: process.env.NEXT_PUBLIC_THIRDWEB_SECRET_KEY,
});

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

  const bannerIPFSUri = await storage.upload(
    Buffer.from(await campaignBanner.arrayBuffer())
  );

  const httpsBannerIPFSUri = bannerIPFSUri.replace(
    "ipfs://",
    "https://ipfs.io/ipfs/"
  );

  const { error } = await supabase.rpc("add_campaign", {
    row_id: userID,
    name: String(campaignName),
    image: httpsBannerIPFSUri,
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
