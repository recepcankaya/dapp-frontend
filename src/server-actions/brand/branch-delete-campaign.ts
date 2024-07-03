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
  const branchName = formData.get("branchName") ?? "";
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

  const { data, error } = await supabase
    .from("campaigns")
    .delete()
    .eq("id", campaignID)
    .select("*")
    .single();

  const branchID = data?.branch_id ?? "";
  const { data: repositionedCampaigns } = await supabase
    .from("campaigns")
    .select("position, id")
    .eq("branch_id", branchID)
    .gt("position", data!?.position)
    .order("position", { ascending: true });

  if (repositionedCampaigns) {
    for (let i = 0; i < repositionedCampaigns.length; i++) {
      const { data: otherPositionsUpdated } = await supabase
        .from("campaigns")
        .update({
          position: repositionedCampaigns[i].position - 1,
        })
        .eq("id", repositionedCampaigns[i].id);
    }
  }

  if (error) {
    return {
      success: false,
      message: "Kampanya silinirken bir hata oluştu. Lütfen tekrar deneyiniz.",
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
      message: "Kampanya başarıyla silindi.",
      campaign: data,
    };
  }
}
