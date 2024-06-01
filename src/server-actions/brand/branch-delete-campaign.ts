"use server";
import { revalidatePath } from "next/cache";
import { ThirdwebStorage } from "@thirdweb-dev/storage";

import { createClient } from "@/src/lib/supabase/server";
import getUserID from "@/src/lib/getUserID";
import { AdminCampaigns, Campaign } from "@/src/lib/types/jsonQuery.types";

export type FormState = {
  success: unknown;
  message: string;
};

const storage = new ThirdwebStorage({
  secretKey: process.env.NEXT_PUBLIC_THIRDWEB_SECRET_KEY,
});

export default async function deleteCampaign(
  prevState: any,
  formData: FormData
) {
  const supabase = createClient();
  const userID = await getUserID();
  const campaignID = formData.get("campaignID");

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
