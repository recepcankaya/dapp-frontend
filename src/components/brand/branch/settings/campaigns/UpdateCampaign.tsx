"use client";
import { useState, useEffect } from "react";
import { useFormState } from "react-dom";
import { toast } from "react-toastify";

import updateCampaign from "@/src/server-actions/brand/branch-update-campaign";
import { getShortLengthToastOptions } from "@/src/lib/toastOptions";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/src/components/ui/alert-dialog";
import { Button } from "@/src/components/ui/button";
import SubmitButton from "@/src/components/ui/submit-button";

type UpdateCampaignProps = {
  isCampaignFavourite: Campaigns["is_favourite"];
  campaignID: Campaigns["id"];
  setCampaignsArray: React.Dispatch<React.SetStateAction<Campaigns[]>>;
};

export type CampaignStatus = {
  success: unknown;
  message: string;
  campaign: Campaigns;
};

export const initialState: CampaignStatus = {
  success: undefined,
  message: "",
  campaign: {
    id: "",
    branch_id: "",
    name: "",
    image_url: "",
    position: 0,
    is_favourite: false,
  },
};

export default function UpdateCampaign({
  isCampaignFavourite,
  campaignID,
  setCampaignsArray,
}: UpdateCampaignProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [state, updateCampaignAction] = useFormState(
    updateCampaign,
    initialState
  );

  useEffect(() => {
    if (state?.success === true) {
      setIsDialogOpen(false);
      toast.success(state.message, getShortLengthToastOptions());
      setCampaignsArray((prev) => {
        const updatedCampaigns = prev?.map((campaign) => {
          if (campaign.id === state.campaign?.id) {
            return { ...campaign, is_favourite: !campaign.is_favourite };
          } else {
            return { ...campaign, is_favourite: false };
          }
        });
        return updatedCampaigns ?? [];
      });
    } else if (state?.success === false) {
      toast.error(state?.message, getShortLengthToastOptions());
    }
  }, [state.success, state.message, setCampaignsArray, state.campaign]);

  return (
    <>
      {isCampaignFavourite ? (
        <div className="w-8 h-8 rounded-full bg-green-600 md:ml-8"></div>
      ) : (
        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button className="w-8 h-8 rounded-full bg-[#DBB5B5] md:ml-8 hover:bg-green-600/30"></Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Yeni Favori Kampanyanızı Güncellemek İstediğinize Emin Misiniz?
              </AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-[#D9D9D9]">
                Vazgeç
              </AlertDialogCancel>
              <form action={updateCampaignAction}>
                <input type="hidden" name="campaignID" value={campaignID} />
                <SubmitButton
                  type="submit"
                  className="bg-[#dbb5b580] text-black hover:bg-[#DBB5B5]"
                  title="Devam Et"
                />
              </form>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
