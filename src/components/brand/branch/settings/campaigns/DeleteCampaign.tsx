"use client";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";

import { getShortLengthToastOptions } from "@/src/lib/toastOptions";
import { initialState } from "@/src/lib/campaignInitialState";
import deleteCampaign from "@/src/server-actions/brand/branch-delete-campaign";

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
import { TrashIcon } from "@/src/components/ui/SVG/Trash";

type DeleteCampaignProps = {
  campaignID: Campaigns["id"];
  campaignName: Campaigns["name"];
  setCampaignsArray: React.Dispatch<React.SetStateAction<Campaigns[] | null>>;
};

export default function DeleteCampaign({
  campaignID,
  campaignName,
  setCampaignsArray,
}: DeleteCampaignProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [state, deleteformAction] = useFormState(deleteCampaign, initialState);
  const params = useParams<{ "brand-home": string }>();

  useEffect(() => {
    if (state?.success === true) {
      setIsDialogOpen(false);
      toast.success(state.message, getShortLengthToastOptions());
      setCampaignsArray(
        (prev) =>
          prev?.filter((campaign) => campaign.id !== state.campaign.id) ?? []
      );
    }

    if (state?.success === false) {
      toast.error(state?.message, getShortLengthToastOptions());
    }
  }, [state?.success, state?.message, setCampaignsArray, state?.campaign]);

  return (
    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <AlertDialogTrigger asChild>
        <Button className="bg-transparent hover:bg-transparent" size="icon">
          <TrashIcon className="hover:scale-110 transition-all" />
          <span className="sr-only">Sil {campaignName}</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Kampanyayı Silmek İstediğinize Emin misiniz?
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-[#D9D9D9]">Vazgeç</AlertDialogCancel>
          <form action={deleteformAction}>
            <input type="hidden" name="campaignID" value={campaignID} />
            <input
              type="hidden"
              name="branchName"
              value={decodeURI(params["brand-home"])}
            />
            <SubmitButton
              type="submit"
              className="bg-[#dbb5b580] text-black hover:bg-[#DBB5B5]"
              title="Devam Et"
            />
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
