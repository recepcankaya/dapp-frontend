"use server";
import { revalidatePath } from "next/cache";

import { createClient } from "@/src/lib/supabase/server";
import getUserID from "@/src/lib/getUserID";

export default async function updateCampaign(
  prevState: any,
  formData: FormData
) {
  const userID = await getUserID();
  const supabase = createClient();
  const campaignID = formData.get("campaignID") as string;

  const { data: favCampaign } = await supabase
    .from("campaigns")
    .select("id, is_favourite")
    .eq("branch_id", userID)
    .eq("is_favourite", true)
    .single();

  if (favCampaign) {
    await supabase
      .from("campaigns")
      .update({ is_favourite: false })
      .eq("id", favCampaign.id);
  }

  const { data: updatedCampaign, error: updatedCampaignError } = await supabase
    .from("campaigns")
    .update({ is_favourite: true })
    .eq("id", campaignID)
    .select()
    .single();

  if (updatedCampaignError || !updatedCampaign) {
    return {
      success: false,
      message:
        "Favori kampanya güncellenirken bir hata oluştu. Lütfen tekrar deneyiniz.",
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
      message: "Favori kampanya başarıyla güncellendi.",
      campaign: updatedCampaign,
    };
  }
}
