"use server";
import { revalidatePath } from "next/cache";

import { createClient } from "@/src/lib/supabase/server";
import getUserID from "@/src/lib/getUserID";
import { AdminCampaigns, Campaign } from "@/src/lib/types/jsonQuery.types";

export type FormState = {
  success: unknown;
  message: string;
};

const PINATA_JWT = process.env.PINATA_JWT;

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
  const campaignIPFSHash = findCampaign?.campaign_image.slice(21);
  await fetch(`https://api.pinata.cloud/pinning/unpin/${campaignIPFSHash}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${PINATA_JWT}`,
    },
  });

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
