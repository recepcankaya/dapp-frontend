"use client";
import { useEffect } from "react";
import { useFormState } from "react-dom";
import Image from "next/image";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import deleteCampaign, {
  FormState,
} from "@/src/server-actions/brand/branch-delete-campaign";

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
import { Label } from "@/src/components/ui/label";
import { RedBinIcon } from "@/src/components/ui/bin";
import type { AdminCampaigns } from "@/src/lib/types/jsonQuery.types";

type BranchCampaignManagementProps = {
  campaigns: AdminCampaigns["campaigns"];
};

const message = {
  success: undefined,
  message: "",
};

export default function BranchCampaignManagement(
  campaigns: BranchCampaignManagementProps
) {
  const [state, formAction] = useFormState(
    deleteCampaign,
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

  return (
    <section className="grid gap-6">
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
      <Card className="pt-12">
        <CardHeader>
          <CardTitle>Kampanya Yönetimi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {campaigns.campaigns && campaigns.campaigns.length > 0 ? (
            <ul className="mt-4">
              {campaigns.campaigns.map((campaign) => (
                <li key={campaign.campaign_id} className="mb-10">
                  <Label>{campaign.campaign_name}</Label>
                  <div className="flex items-center justify-around">
                    <Image
                      src={campaign.campaign_image.replace(
                        "ipfs://",
                        "https://ipfs.io/ipfs/"
                      )}
                      alt={campaign.campaign_name || ""}
                      width={300}
                      height={150}
                      quality={100}
                      priority
                      className="mt-4"
                    />
                    <AlertDialog>
                      <AlertDialogTrigger>
                        <RedBinIcon />
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Kampanya Silme İşlemi
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
                            {/* <AlertDialogAction>Devam Et</AlertDialogAction> */}
                            <button>Devam Et</button>
                          </form>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>Aktif kampanyanız bulunmamaktadır.</p>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
