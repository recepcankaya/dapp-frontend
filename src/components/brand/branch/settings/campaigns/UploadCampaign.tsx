"use client";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useFormState } from "react-dom";
import { Bounce, ToastOptions, toast } from "react-toastify";

import addCampaign, {
  type Status,
} from "@/src/server-actions/brand/branch-add-campaign";

import { Checkbox } from "@/src/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import AddIcon from "@/src/components/ui/add";
import SubmitButton from "@/src/components/ui/submit-button";

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

export default function UploadCampaign() {
  const params = useParams<{ "brand-home": string }>();
  const [addState, addFormAction] = useFormState(
    addCampaign,
    initialState as Status
  );

  useEffect(() => {
    if (addState?.success === true) {
      toast.success(addState.message, toastOptions);
    }

    if (addState?.success === false) {
      toast.error(addState?.message, toastOptions);
    }
  }, [addState]);

  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold">Kampanya Yönetimi</h1>
      <Dialog>
        <DialogTrigger>
          <AddIcon />
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Kampanya Ekle</DialogTitle>
            <DialogDescription>
              Müşterilerine göstermek istediğiniz kampanyayı ekleyin.
            </DialogDescription>
          </DialogHeader>
          <form action={addFormAction} className="grid gap-4 py-4">
            <input
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
                className="col-span-3"
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
                className="col-span-3"
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="favourite" name="favourite" />
              <Label
                htmlFor="favourite"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Favori afiş
              </Label>
            </div>
            <DialogFooter>
              <SubmitButton type="submit" className="" title="Kaydet" />
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
