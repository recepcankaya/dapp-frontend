"use client";
import { Fragment, useRef, useState } from "react";
import Image from "next/image";

import { createClient } from "@/src/lib/supabase/client";
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
  branchID: BrandBranch["id"];
};

export default function BranchCampaignManagement({
  campaigns,
  branchID,
}: BranchCampaignManagementProps) {
  const [campaignsArray, setCampaignsArray] = useState<Campaigns[] | null>(
    campaigns ? [...campaigns] : null
  );
  const draggedCampaign = useRef<number | null>(null);
  const replacedCampaign = useRef<number | null>(null);
  const supabase = createClient();

  /**
   * Handles the drag start event for a campaign item.
   *
   * @param e - The drag event object.
   * @param index - The index of the campaign item being dragged.
   */
  const handleDragStart = (e: React.DragEvent, index: number) => {
    draggedCampaign.current = index;
  };

  /**
   * Handles the drag enter event for a campaign item.
   *
   * @param e - The drag event object.
   * @param index - The index of the campaign being replaced.
   */
  const handleDragEnter = (e: React.DragEvent, index: number) => {
    replacedCampaign.current = index;
  };

  /**
   * Handles the drag end event for campaign items.
   * @param e - The drag event object.
   */
  const handleDragEnd = async (e: React.DragEvent) => {
    if (
      replacedCampaign.current !== null &&
      draggedCampaign.current !== null &&
      campaigns
    ) {
      if (draggedCampaign.current === replacedCampaign.current) {
        return;
      }

      if (draggedCampaign.current > replacedCampaign.current) {
        const { data: draggedCampaignPositionUpdated } = await supabase
          .from("campaigns")
          .update({
            position: replacedCampaign.current,
          })
          .eq("branch_id", branchID)
          .eq("position", draggedCampaign.current)
          .select("id")
          .single();

        const { data: positions } = await supabase
          .from("campaigns")
          .select("position, id")
          .eq("branch_id", branchID)
          .gte("position", replacedCampaign.current)
          .lt("position", draggedCampaign.current);

        for (let i = 0; i < positions!.length; i++) {
          if (positions![i].id !== draggedCampaignPositionUpdated!.id) {
            const { data: otherPositionsUpdated } = await supabase
              .from("campaigns")
              .update({
                position: positions![i].position + 1,
              })
              .eq("id", positions![i].id);
          }
        }

        const { data: updatedCampaigns } = await supabase
          .from("campaigns")
          .select("*")
          .eq("branch_id", branchID)
          .order("position", { ascending: true });

        setCampaignsArray([...updatedCampaigns!]);
      } else {
        const { data: draggedCampaignPositionUpdated } = await supabase
          .from("campaigns")
          .update({
            position: replacedCampaign.current,
          })
          .eq("branch_id", branchID)
          .eq("position", draggedCampaign.current)
          .select("id")
          .single();

        const { data: positions } = await supabase
          .from("campaigns")
          .select("position, id")
          .eq("branch_id", branchID)
          .lte("position", replacedCampaign.current)
          .gt("position", draggedCampaign.current);

        for (let i = 0; i < positions!.length; i++) {
          if (positions![i].id !== draggedCampaignPositionUpdated!.id) {
            const { data: otherPositionsUpdated } = await supabase
              .from("campaigns")
              .update({
                position: positions![i].position - 1,
              })
              .eq("id", positions![i].id);
          }
        }

        const { data: updatedCampaigns } = await supabase
          .from("campaigns")
          .select("*")
          .eq("branch_id", branchID)
          .order("position", { ascending: true });

        setCampaignsArray([...updatedCampaigns!]);
      }
    }
  };

  return (
    <section className="container mx-auto px-4 md:px-6 py-8 bg-[#D9D9D9] text-black mt-24">
      <UploadCampaign setCampaignsArray={setCampaignsArray!} />
      {campaignsArray && campaignsArray.length > 0 ? (
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
              {campaignsArray.map((campaign: Campaigns, index: number) => (
                <Fragment key={campaign.id}>
                  <TableRow
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragEnter={(e) => handleDragEnter(e, index)}
                    onDragEnd={(e) => handleDragEnd(e)}
                    className="hover:bg-gray-200 border-none active:cursor-grabbing">
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
                        priority
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
                  {/* <div className="w-full h-0.5 bg-violet-400" /> */}
                </Fragment>
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
