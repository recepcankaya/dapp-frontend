"use client";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";

import { getShortLengthToastOptions } from "@/src/lib/toastOptions";
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

type DeleteCampaignProps = {
  campaignID: Campaigns["id"];
  campaignName: Campaigns["name"];
  setCampaignsArray: React.Dispatch<React.SetStateAction<Campaigns[] | null>>;
};

export type Status = {
  success: unknown;
  message: string;
  campaign: Campaigns;
};

export const initialState: Status = {
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
          <Trash className="hover:scale-110 transition-all" />
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

function Trash(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="35"
      height="34"
      viewBox="0 0 35 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <path
        d="M13.3738 5.66665C13.9744 4.01596 15.595 2.83331 17.4998 2.83331C19.4049 2.83331 21.0254 4.01596 21.6259 5.66665"
        stroke="black"
        strokeOpacity="0.45"
        strokeWidth="3.75"
        strokeLinecap="round"
      />
      <path
        d="M29.8958 8.5H5.104"
        stroke="black"
        strokeOpacity="0.45"
        strokeWidth="3.75"
        strokeLinecap="round"
      />
      <path
        d="M26.7947 21.8154C26.5366 25.5765 26.4075 27.4571 25.146 28.6035C23.8846 29.75 21.9444 29.75 18.0641 29.75H16.9362C13.0559 29.75 11.1157 29.75 9.85424 28.6035C8.59277 27.4571 8.46371 25.5765 8.2056 21.8154L7.53485 12.0417M27.4654 12.0417L27.1737 16.2917"
        stroke="black"
        strokeOpacity="0.45"
        strokeWidth="3.75"
        strokeLinecap="round"
      />
      <path
        d="M13.8542 15.5833L14.5834 22.6666"
        stroke="black"
        strokeOpacity="0.45"
        strokeWidth="3.75"
        strokeLinecap="round"
      />
      <path
        d="M21.1459 15.5833L20.4167 22.6666"
        stroke="black"
        strokeOpacity="0.45"
        strokeWidth="3.75"
        strokeLinecap="round"
      />
    </svg>
  );
}
