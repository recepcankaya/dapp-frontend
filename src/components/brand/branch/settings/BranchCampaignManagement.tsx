"use client";
import Image from "next/image";

import DeleteCampaign from "./campaigns/DeleteCampaign";
import UploadCampaign from "./campaigns/UploadCampaign";
import type { AdminCampaigns } from "@/src/lib/types/jsonQuery.types";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/src/components/ui/alert-dialog";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/src/components/ui/table";
import { RedBinIcon } from "@/src/components/ui/bin";
import { Button } from "@/src/components/ui/button";

type BranchCampaignManagementProps = {
  campaigns: AdminCampaigns["campaigns"];
};

export default function BranchCampaignManagement({
  campaigns,
}: BranchCampaignManagementProps) {
  return (
    <section className="container mx-auto px-4 md:px-6 py-8 bg-white text-black mt-24">
      <UploadCampaign />
      {campaigns && campaigns.length > 0 ? (
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
              {campaigns.map((campaign) => (
                <TableRow
                  key={campaign.campaign_id}
                  className="hover:bg-gray-100">
                  <TableCell className="p-4">
                    {campaign.favourite ? "✅" : ""}
                  </TableCell>
                  <TableCell className="p-4">
                    <Image
                      src={campaign.campaign_image}
                      alt={campaign.campaign_name ?? "Kampanya resmi"}
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
                              Kampanya Silme İşlemi
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Bu işlem geri alınamaz. Devam etmek istediğinize
                              emin misiniz?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Vazgeç</AlertDialogCancel>
                            <DeleteCampaign campaignID={campaign.campaign_id} />
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <p>Aktif kampanyanız bulunmamaktadır.</p>
      )}
    </section>
  );
}
