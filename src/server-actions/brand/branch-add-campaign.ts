"use server";
import { revalidatePath } from "next/cache";

import { createClient } from "@/src/lib/supabase/server";
import getUserID from "@/src/lib/getUserID";
import decodeTurkishCharacters from "@/src/lib/convertToEnglishCharacters";

export default async function addCampaign(prevState: any, formData: FormData) {
  const supabase = createClient();
  const userID = await getUserID();
  const campaignName = formData.get("campaignName") as string;
  const campaignBanner = formData.get("banner");
  const campaignFavourite =
    formData.get("favourite")?.toString() === "on" ? true : false;
  const branchName = formData.get("branchName");
  const campaignNameForImage = campaignName?.replace(/\s/g, "-");
  const turnCampaignToEnglishChar =
    decodeTurkishCharacters(campaignNameForImage);
  const convertToEnglish = decodeTurkishCharacters(String(branchName));

  if (!campaignName || campaignName?.length < 3) {
    return {
      success: false,
      message: "Kampanya adı en az 3 karakter olmalıdır.",
      campaign: {
        id: "",
        branch_id: "",
        name: "",
        image_url: "",
        position: 0,
        is_favourite: false,
      },
    };
  }

  if (!campaignBanner) {
    return {
      success: false,
      message: "Kampanya afişi eklemelisiniz.",
      campaign: {
        id: "",
        branch_id: "",
        name: "",
        image_url: "",
        position: 0,
        is_favourite: false,
      },
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
      campaign: {
        id: "",
        branch_id: "",
        name: "",
        image_url: "",
        position: 0,
        is_favourite: false,
      },
    };
  }

  const { error: uploadingError } = await supabase.storage
    .from("campaigns")
    .upload(`${convertToEnglish}/${turnCampaignToEnglishChar}`, campaignBanner);

  if (uploadingError) {
    return {
      success: false,
      message: "Kampanya yüklenirken bir hata oluştu. Lütfen tekrar deneyiniz.",
      campaign: {
        id: "",
        branch_id: "",
        name: "",
        image_url: "",
        position: 0,
        is_favourite: false,
      },
    };
  }

  const { data: productURL } = supabase.storage
    .from("campaigns")
    .getPublicUrl(`${convertToEnglish}/${turnCampaignToEnglishChar}`);

  const { data: campaign, error } = await supabase
    .from("campaigns")
    .insert({
      branch_id: userID,
      name: campaignName,
      image_url: productURL.publicUrl,
      is_favourite: campaignFavourite,
    })
    .select();

  if (error) {
    return {
      success: false,
      message: "Kampanya eklenirken bir hata oluştu. Lütfen tekrar deneyiniz.",
      campaign: {
        id: "",
        branch_id: "",
        name: "",
        image_url: "",
        position: 0,
        is_favourite: false,
      },
    };
  } else {
    revalidatePath("/brand/[brand-home]/settings", "page");
    return {
      success: true,
      message: "Kampanya başarıyla eklendi.",
      campaign: campaign[0],
    };
  }
}
