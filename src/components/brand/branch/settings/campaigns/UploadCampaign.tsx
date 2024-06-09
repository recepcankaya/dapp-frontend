"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useFormState } from "react-dom";
import { toast } from "react-toastify";

import { shortLengthToastOptions } from "@/src/lib/toastOptions";
import { initialState } from "@/src/lib/feedbackForForms";
import addCampaign from "@/src/server-actions/brand/branch-add-campaign";

import { Checkbox } from "@/src/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import SubmitButton from "@/src/components/ui/submit-button";

export default function UploadCampaign() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const params = useParams<{ "brand-home": string }>();
  const [addState, addFormAction] = useFormState(addCampaign, initialState);

  useEffect(() => {
    if (addState?.success === true) {
      setIsDialogOpen(false);
      toast.success(addState.message, shortLengthToastOptions);
    }

    if (addState?.success === false) {
      toast.error(addState?.message, shortLengthToastOptions);
    }
  }, [addState]);

  return (
    <div className="flex justify-center items-center mb-6 relative">
      <h1 className="text-2xl font-bold underline underline-offset-4 absolute left-1/2 transform -translate-x-1/2">
        Kampanya Yönetimi
      </h1>
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

export function AddIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <path
        d="M13.75 10C13.75 9.30965 14.3096 8.75 15 8.75C15.6904 8.75 16.25 9.30964 16.25 10V13.75H20C20.6904 13.75 21.25 14.3096 21.25 15C21.25 15.6904 20.6904 16.25 20 16.25H16.25V20C16.25 20.6904 15.6904 21.25 15 21.25C14.3096 21.25 13.75 20.6904 13.75 20V16.25H10C9.30965 16.25 8.75 15.6904 8.75 15C8.75 14.3096 9.30964 13.75 10 13.75H13.75V10Z"
        fill="#0F0F0F"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M28.75 5C28.75 2.92894 27.0711 1.25 25 1.25H5C2.92894 1.25 1.25 2.92894 1.25 5V25C1.25 27.0711 2.92894 28.75 5 28.75H25C27.0711 28.75 28.75 27.0711 28.75 25V5ZM26.25 5C26.25 4.30965 25.6904 3.75 25 3.75H5C4.30965 3.75 3.75 4.30965 3.75 5V25C3.75 25.6904 4.30965 26.25 5 26.25H25C25.6904 26.25 26.25 25.6904 26.25 25V5Z"
        fill="#0F0F0F"
      />
    </svg>
  );
}
