"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useFormState } from "react-dom";
import { toast } from "react-toastify";

import { getShortLengthToastOptions } from "@/src/lib/toastOptions";
import { initialState } from "@/src/lib/campaignInitialState";
import addCampaign from "@/src/server-actions/brand/branch-add-campaign";

import { Checkbox } from "@/src/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import SubmitButton from "@/src/components/ui/submit-button";
import { AddIcon } from "@/src/components/ui/SVG/Add";

type UploadCampaignProps = {
  setCampaignsArray: React.Dispatch<React.SetStateAction<Campaigns[]>>;
};

export default function UploadCampaign({
  setCampaignsArray,
}: UploadCampaignProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [addState, addFormAction] = useFormState(addCampaign, initialState);
  const params = useParams<{ "brand-home": string }>();

  useEffect(() => {
    if (addState?.success === true) {
      setIsDialogOpen(false);
      toast.success(addState.message, getShortLengthToastOptions());
      setCampaignsArray((prev) => {
        const updatedCampaigns = prev?.map((campaign) => {
          if (
            addState.campaign.is_favourite &&
            campaign.id !== addState.campaign.id
          ) {
            return { ...campaign, is_favourite: false };
          }
          return campaign;
        });
        return [...(updatedCampaigns ?? []), addState.campaign];
      });
    }

    if (addState?.success === false) {
      toast.error(addState?.message, getShortLengthToastOptions());
    }
  }, [
    addState.success,
    addState.message,
    setCampaignsArray,
    addState.campaign,
  ]);

  return (
    <div className="flex justify-center items-center mb-6 relative">
      <div className="ml-auto">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger>
            <AddIcon className="hover:scale-110 transition-all" />
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Kampanya Ekle</DialogTitle>
            </DialogHeader>
            <form
              action={addFormAction}
              className="grid gap-4 items-center py-4">
              <Input
                type="hidden"
                name="branchName"
                value={decodeURI(params["brand-home"])}
              />
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  İsmi
                </Label>
                <Input
                  id="name"
                  name="campaignName"
                  className="col-span-3 bg-[#dbb5b59d]"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="banner" className="text-right">
                  Afişi
                </Label>
                <Input
                  id="banner"
                  type="file"
                  name="banner"
                  className="col-span-3 bg-[#dbb5b59d]"
                  required
                />
              </div>
              <div className="flex gap-6 items-center justify-end">
                <Checkbox id="favourite" name="favourite" />
                <Label
                  htmlFor="favourite"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 w-[73%]">
                  Favori afiş
                </Label>
              </div>
              <DialogFooter>
                <SubmitButton type="submit" className="mt-8" title="Kaydet" />
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
