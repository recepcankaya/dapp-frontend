"use server";
import { revalidatePath } from "next/cache";

import { createClient } from "@/src/lib/supabase/server";
import getUserID from "@/src/lib/getUserID";
import decodeTurkishCharacters from "@/src/lib/convertToEnglishCharacters";

export type Status = {
  success: unknown;
  message: string;
};

export default async function addCampaign(prevState: any, formData: FormData) {
  const supabase = createClient();
  const userID = await getUserID();
  const campaignName = formData.get("campaignName") as String;
  const campaignBanner = formData.get("banner");
  const campaignFavourite = formData.get("favourite");
  const branchName = formData.get("branchName");
  const campaignNameForImage = campaignName?.replace(/\s/g, "-");
  const convertToEnglish = decodeTurkishCharacters(String(branchName));

  console.log("Checkpoint 1...");

  if (!campaignName || campaignName?.length < 3) {
    return {
      success: false,
      message: "Kampanya adı en az 3 karakter olmalıdır.",
    };
  }

  console.log("Checkpoint 2...");

  if (!campaignBanner) {
    return {
      success: false,
      message: "Kampanya afişi eklemelisiniz.",
    };
  }

  console.log("Checkpoint 3...");

  const { data: info } = await supabase
    .from("brand_branch")
    .select("branch_name, brand (brand_name)")
    .eq("id", userID)
    .single();

  console.log("Checkpoint 4...");

  if (!info) {
    return {
      success: false,
      message: "Kullanıcı bulunamadı. Lütfen tekrar giriş yapınız.",
    };
  }

  const { error: uploadingError } = await supabase.storage
    .from("campaigns")
    .upload(`${convertToEnglish}/${campaignNameForImage}`, campaignBanner);

  console.log("error", uploadingError);

  if (uploadingError) {
    return {
      success: false,
      message: "Kampanya yüklenirken bir hata oluştu. Lütfen tekrar deneyiniz.",
    };
  }

  console.log("Checkpoint 5...");

  const { data: productURL } = supabase.storage
    .from("campaigns")
    .getPublicUrl(`${convertToEnglish}/${campaignNameForImage}`);

  const { error } = await supabase.rpc("add_campaign", {
    row_id: userID,
    name: String(campaignName),
    image: productURL.publicUrl,
    favourite: Boolean(campaignFavourite),
  });

  if (error) {
    console.log("Checkpoint 6...");

    return {
      success: false,
      message: "Kampanya eklenirken bir hata oluştu. Lütfen tekrar deneyiniz.",
    };
  } else {
    console.log("Checkpoint 7...");

    revalidatePath("/brand/[brand-home]/settings", "page");
    return { success: true, message: "Kampanya başarıyla eklendi." };
  }
}
