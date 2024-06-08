"use client";
import { useParams } from "next/navigation";
import { useFormState } from "react-dom";

import deleteCampaign, {
  FormState,
} from "@/src/server-actions/brand/branch-delete-campaign";

import { Bounce, ToastOptions, toast } from "react-toastify";
import SubmitButton from "@/src/components/ui/submit-button";
import { useEffect } from "react";

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
  campaignID: string;
};

export default function DeleteCampaign({ campaignID }: DeleteCampaignProps) {
  const params = useParams<{ "brand-home": string }>();
  const [state, deleteformAction] = useFormState(
    deleteCampaign,
    initialState as FormState
  );

  useEffect(() => {
    if (state?.success === true) {
      toast.success(state.message, toastOptions);
    }

    if (state?.success === false) {
      toast.error(state?.message, toastOptions);
    }
  }, [state]);

  return (
    <form action={deleteformAction}>
      <input type="hidden" name="campaignID" value={campaignID} />
      <input
        type="hidden"
        name="branchName"
        value={decodeURI(params["brand-home"])}
      />
      <SubmitButton type="submit" className="" title="Devam Et" />
    </form>
  );
}
