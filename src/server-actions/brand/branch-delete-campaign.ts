"use server";
import { revalidatePath } from "next/cache";

import { createClient } from "@/src/lib/supabase/server";
import decodeTurkishCharacters from "@/src/lib/convertToEnglishCharacters";

export default async function deleteCampaign(
  prevState: any,
  formData: FormData
) {
  const supabase = createClient();
  const campaignID = formData.get("campaignID") as string;
  const branchName = formData.get("branchName");
  const convertToEnglish = decodeTurkishCharacters(String(branchName));

  const { data: campaign } = await supabase
    .from("campaigns")
    .select("*")
    .eq("id", campaignID)
    .single();

  const { error: deleteCampaignImage } = await supabase.storage
    .from("campaigns")
    .remove([`${convertToEnglish}/${campaign?.name}`]);
  
  if (deleteCampaignImage) {
    return {
      success: false,
      message: "Kampanya silinirken bir hata oluştu. Lütfen tekrar deneyiniz.",
    };
  }

  const { error } = await supabase.from("campaigns").delete().eq("id", campaignID);

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
