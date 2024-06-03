"use client";
import { useEffect } from "react";
import { useFormState } from "react-dom";
import Image from "next/image";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import deleteCampaign, {
  FormState,
} from "@/src/server-actions/brand/branch-delete-campaign";
import type { AdminCampaigns } from "@/src/lib/types/jsonQuery.types";

import {
  CardTitle,
  CardHeader,
  CardContent,
  Card,
} from "@/src/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/src/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/src/components/ui/table";
import { Label } from "@/src/components/ui/label";
import { RedBinIcon } from "@/src/components/ui/bin";
import AddIcon from "@/src/components/ui/add";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Checkbox } from "@/src/components/ui/checkbox";
import addCampaign from "@/src/server-actions/brand/branch-add-campaign";

type BranchCampaignManagementProps = {
  campaigns: AdminCampaigns["campaigns"];
};

const message = {
  success: undefined,
  message: "",
};

export default function BranchCampaignManagement({
  campaigns,
}: BranchCampaignManagementProps) {
  const [state, formAction] = useFormState(
    deleteCampaign,
    message as FormState
  );
  const [addState, addFormAction] = useFormState(
    addCampaign,
    message as FormState
  );

  useEffect(() => {
    if (state?.success === true) {
      toast.success(state.message);
    }

    if (state?.success === false) {
      toast.error(state?.message);
    }
  }, [state]);

  useEffect(() => {
    if (addState?.success === true) {
      toast.success(addState.message);
    }

    if (addState?.success === false) {
      toast.error(addState?.message);
    }
  }, [addState]);

  return (
    <section className="container mx-auto px-4 md:px-6 py-8 bg-white text-black mt-24">
      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
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
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  İsmi
                </Label>
                <Input id="name" name="campaignName" className="col-span-3" />
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
                <Button type="submit">Kaydet</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/4 p-4">Kampanya Favori mi?</TableHead>
              <TableHead className="w-1/4 p-4">Kampanyanın Resmi</TableHead>
              <TableHead className="w-1/4 p-4">Kampanyanın Adı</TableHead>
              <TableHead className="w-1/4 p-4"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaigns && campaigns.length > 0 ? (
              campaigns.map((campaign) => (
                <TableRow
                  key={campaign.campaign_id}
                  className="hover:bg-gray-100">
                  <TableCell className="p-4">
                    {campaign.favourite ? "✅" : ""}
                  </TableCell>
                  <TableCell className="p-4">
                    <img
                      src={campaign.campaign_image}
                      alt={campaign.campaign_name}
                      width={128}
                      height={128}
                      className="rounded-md object-cover"
                    />
                  </TableCell>
                  <TableCell className="p-4 font-medium">
                    {campaign.campaign_name}
                  </TableCell>
                  <TableCell className="p-4">
                    <div className="flex gap-2">
                      <AlertDialog>
                        <AlertDialogTrigger>
                          <Button variant="ghost" size="icon">
                            <RedBinIcon className="h-5 w-5 text-red-500" />
                            <span className="sr-only">
                              Sil {campaign.campaign_name}
                            </span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Ürün Silme İşlemi
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Bu işlem geri alınamaz. Devam etmek istediğinize
                              emin misiniz?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Vazgeç</AlertDialogCancel>
                            <form action={formAction}>
                              <input
                                type="hidden"
                                name="campaignID"
                                value={campaign.campaign_id}
                              />
                              <Button>Devam Et</Button>
                            </form>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <p>Aktif kampanyanız bulunmamaktadır.</p>
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
