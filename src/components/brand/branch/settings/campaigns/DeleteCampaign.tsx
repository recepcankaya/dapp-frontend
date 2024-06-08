"use client";
import { useParams } from "next/navigation";
import { useFormState } from "react-dom";

import deleteCampaign, {
  FormState,
} from "@/src/server-actions/brand/branch-delete-campaign";

import { Bounce, ToastOptions, toast } from "react-toastify";
import SubmitButton from "@/src/components/ui/submit-button";
import { useEffect, useState } from "react";
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
import { Campaign } from "@/src/lib/types/jsonQuery.types";

const initialState = {
  success: undefined,
  message: "",
};

const toastOptions: ToastOptions = {
  position: "top-right",
  autoClose: 1500,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light",
  transition: Bounce,
};

type DeleteCampaignProps = {
  campaignID: Campaign["campaign_id"];
  campaignName: Campaign["campaign_name"];
};

export default function DeleteCampaign({
  campaignID,
  campaignName,
}: DeleteCampaignProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const params = useParams<{ "brand-home": string }>();
  const [state, deleteformAction] = useFormState(
    deleteCampaign,
    initialState as FormState
  );

  useEffect(() => {
    if (state?.success === true) {
      setIsDialogOpen(false);
      toast.success(state.message, toastOptions);
    }

    if (state?.success === false) {
      toast.error(state?.message, toastOptions);
    }
  }, [state]);

  return (
    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <AlertDialogTrigger>
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
        stroke-opacity="0.45"
        stroke-width="3.75"
        stroke-linecap="round"
      />
      <path
        d="M29.8958 8.5H5.104"
        stroke="black"
        stroke-opacity="0.45"
        stroke-width="3.75"
        stroke-linecap="round"
      />
      <path
        d="M26.7947 21.8154C26.5366 25.5765 26.4075 27.4571 25.146 28.6035C23.8846 29.75 21.9444 29.75 18.0641 29.75H16.9362C13.0559 29.75 11.1157 29.75 9.85424 28.6035C8.59277 27.4571 8.46371 25.5765 8.2056 21.8154L7.53485 12.0417M27.4654 12.0417L27.1737 16.2917"
        stroke="black"
        stroke-opacity="0.45"
        stroke-width="3.75"
        stroke-linecap="round"
      />
      <path
        d="M13.8542 15.5833L14.5834 22.6666"
        stroke="black"
        stroke-opacity="0.45"
        stroke-width="3.75"
        stroke-linecap="round"
      />
      <path
        d="M21.1459 15.5833L20.4167 22.6666"
        stroke="black"
        stroke-opacity="0.45"
        stroke-width="3.75"
        stroke-linecap="round"
      />
    </svg>
  );
}
