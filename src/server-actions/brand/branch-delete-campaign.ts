"use server";
import { revalidatePath } from "next/cache";

import { createClient } from "@/src/lib/supabase/server";
import getUserID from "@/src/lib/getUserID";
import { AdminCampaigns, Campaign } from "@/src/lib/types/jsonQuery.types";
import decodeTurkishCharacters from "@/src/lib/convertToEnglishCharacters";

export default async function deleteCampaign(
  prevState: any,
  formData: FormData
) {
  const supabase = createClient();
  const userID = await getUserID();
  const campaignID = formData.get("campaignID");
  const branchName = formData.get("branchName");
  const convertToEnglish = decodeTurkishCharacters(String(branchName));

  const { data } = await supabase
    .from("brand_branch")
    .select("campaigns")
    .eq("id", userID);

  if (!data || !data[0].campaigns) {
    return;
  }

  const campaigns: AdminCampaigns["campaigns"] = data[0]
    .campaigns as Campaign[];
  const findCampaign = campaigns.find(
    (campaign) => Number(campaign.campaign_id) === Number(campaignID)
  );
  const imageName = findCampaign?.campaign_image.split("/").pop();

  const { error: deleteCampaignImage } = await supabase.storage
    .from("campaigns")
    .remove([`${convertToEnglish}/${imageName}`]);

  if (deleteCampaignImage) {
    return {
      success: false,
      message: "Kampanya silinirken bir hata oluştu. Lütfen tekrar deneyiniz.",
    };
  }

  const { error } = await supabase.rpc("delete_spesific_campaign", {
    row_id: userID,
    object_id: Number(findCampaign?.campaign_id),
  });

  if (error) {
    return {
      success: false,
      message: "Kampanya silinirken bir hata oluştu. Lütfen tekrar deneyiniz.",
    };
  } else {
    revalidatePath("/brand/[brand-home]/settings", "page");
    return { success: true, message: "Kampanya başarıyla silindi." };
  }
}
