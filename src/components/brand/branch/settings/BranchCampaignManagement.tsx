"use client";
import Image from "next/image";

import DeleteCampaign from "./campaigns/DeleteCampaign";
import UploadCampaign from "./campaigns/UploadCampaign";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/src/components/ui/table";

type BranchCampaignManagementProps = {
  campaigns: Campaigns[] | null;
};

export default function BranchCampaignManagement({
  campaigns,
}: BranchCampaignManagementProps) {
  return (
    <section className="container mx-auto px-4 md:px-6 py-8 bg-[#D9D9D9] text-black mt-24">
      <UploadCampaign />
      {campaigns && campaigns.length > 0 ? (
        <div className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/7 p-4">Kampanya Favori mi?</TableHead>
                <TableHead className="w-2/7 p-4">Kampanyanın Resmi</TableHead>
                <TableHead className="w-2/7 p-4">Kampanyanın Adı</TableHead>
                <TableHead className="w-1/7 p-4"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((campaign) => (
                <TableRow
                  key={campaign.id}
                  className="hover:bg-gray-200 border-none">
                  <TableCell className="p-4">
                    {campaign.is_favourite ? (
                      <div className="w-8 h-8 rounded-full bg-green-600 md:ml-8"></div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[#DBB5B5] md:ml-8"></div>
                    )}
                  </TableCell>
                  <TableCell className="p-4">
                    <Image
                      src={campaign.image_url}
                      alt={campaign.name ?? "Kampanya resmi"}
                      width={128}
                      height={128}
                      className="rounded-md object-cover"
                    />
                  </TableCell>
                  <TableCell className="p-4 font-medium">
                    {campaign.name}
                  </TableCell>
                  <TableCell className="p-4">
                    <DeleteCampaign
                      campaignID={campaign.id}
                      campaignName={campaign.name}
                    />
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
