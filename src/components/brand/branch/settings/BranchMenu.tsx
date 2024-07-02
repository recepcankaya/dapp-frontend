"use client";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { createClient } from "@/src/lib/supabase/client";

import UploadMenu from "./menu/UploadMenu";
import EditMenu from "./menu/EditMenu";
import DeleteMenuItem from "./menu/DeleteMenuItem";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/src/components/ui/table";

import type { Product } from "@/src/lib/types/product.types";

type BranchMenuProps = {
  menus: Menus[] | null;
  branchID: BrandBranch["id"];
};

export default function BranchMenu({ menus, branchID }: BranchMenuProps) {
  const [menusArray, setMenusArray] = useState<Menus[] | null>(
    menus ? [...menus] : null
  );
  const draggedProduct = useRef<number | null>(null);
  const replacedProduct = useRef<number | null>(null);
  const supabase = createClient();
  const categories = menusArray
    ? Array.from(new Set(menusArray.map((item) => item.category)))
    : [];
  /**
   * Handles the drag start event for a Menu item.
   *
   * @param e - The drag event object.
   * @param index - The index of the Menu item being dragged.
   */
  const handleDragStart = (e: React.DragEvent, index: number) => {
    draggedProduct.current = index;
  };

  /**
   * Handles the drag enter event for a Menu item.
   *
   * @param e - The drag event object.
   * @param index - The index of the Menu being replaced.
   */
  const handleDragEnter = (e: React.DragEvent, index: number) => {
    replacedProduct.current = index;
  };

  /**
   * Handles the drag end event for Menu items.
   * @param e - The drag event object.
   */
  const handleDragEnd = async (e: React.DragEvent) => {
    if (
      replacedProduct.current !== null &&
      draggedProduct.current !== null &&
      menus
    ) {
      if (draggedProduct.current === replacedProduct.current) {
        return;
      }

      if (draggedProduct.current > replacedProduct.current) {
        const { data: draggedProductPositionUpdated, error } = await supabase
          .from("menus")
          .update({
            position: replacedProduct.current,
          })
          .eq("branch_id", branchID)
          .eq("position", draggedProduct.current)
          .select("id")
          .single();

        const { data: positions } = await supabase
          .from("menus")
          .select("position, id")
          .eq("branch_id", branchID)
          .gte("position", replacedProduct.current)
          .lt("position", draggedProduct.current);

        for (let i = 0; i < positions!.length; i++) {
          if (positions![i].id !== draggedProductPositionUpdated!.id) {
            const { data: otherPositionsUpdated } = await supabase
              .from("menus")
              .update({
                position: positions![i].position + 1,
              })
              .eq("id", positions![i].id);
          }
        }

        const { data: updatedMenus } = await supabase
          .from("menus")
          .select("*")
          .eq("branch_id", branchID)
          .order("position", { ascending: true });

        setMenusArray([...updatedMenus!]);
      } else {
        const { data: draggedProductPositionUpdated } = await supabase
          .from("menus")
          .update({
            position: replacedProduct.current,
          })
          .eq("branch_id", branchID)
          .eq("position", draggedProduct.current)
          .select("id")
          .single();

        const { data: positions } = await supabase
          .from("menus")
          .select("position, id")
          .eq("branch_id", branchID)
          .lte("position", replacedProduct.current)
          .gt("position", draggedProduct.current);

        for (let i = 0; i < positions!.length; i++) {
          if (positions![i].id !== draggedProductPositionUpdated!.id) {
            const { data: otherPositionsUpdated } = await supabase
              .from("menus")
              .update({
                position: positions![i].position - 1,
              })
              .eq("id", positions![i].id);
          }
        }

        const { data: updatedMenus } = await supabase
          .from("menus")
          .select("*")
          .eq("branch_id", branchID)
          .order("position", { ascending: true });

        setMenusArray([...updatedMenus!]);
      }
    }
  };
  return (
    <div className="container mx-auto px-4 md:px-6 py-8 bg-[#D9D9D9] text-black mt-24">
      <UploadMenu setMenusArray={setMenusArray} categories={categories} />
      {menusArray && menusArray.length > 0 ? (
        categories.map((category) => (
          <ul key={category} className="mt-12">
            <h2 className="text-xl font-bold mb-4">{category}</h2>
            <div className="overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/5 p-4">Ürünün Resmi</TableHead>
                    <TableHead className="w-1/5 p-4">Ürünün Adı</TableHead>
                    <TableHead className="w-1/5 p-4">
                      Ürünün Açıklaması
                    </TableHead>
                    <TableHead className="w-1/5 p-4">Ürünün Fiyatı</TableHead>
                    <TableHead className="w-1/5 p-4">
                      Ürün İçin Aksiyonlar
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {menusArray
                    .filter((product) => product.category === category)
                    .map((product: Menus, index: number) => (
                      <TableRow
                        draggable
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragEnter={(e) => handleDragEnter(e, index)}
                        onDragEnd={(e) => handleDragEnd(e)}
                        key={product.id}
                        className="hover:bg-gray-200 border-none"
                      >
                        <TableCell className="p-4">
                          <Image
                            src={
                              product.image_url && product.image_url.length > 0
                                ? product.image_url
                                : "/"
                            }
                            alt={product.name}
                            width={64}
                            height={64}
                            className="rounded-md object-cover"
                          />
                        </TableCell>
                        <TableCell className="p-4 font-medium">
                          {product.name}
                        </TableCell>
                        <TableCell className="p-4">
                          {product.description}
                        </TableCell>
                        <TableCell className="p-4">
                          {product.price + " TL"}
                        </TableCell>
                        <TableCell className="p-4">
                          <div className="flex gap-2">
                            <EditMenu
                              product={product}
                              setMenusArray={setMenusArray}
                            />
                            <DeleteMenuItem
                              product={product}
                              setMenusArray={setMenusArray}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </ul>
        ))
      ) : (
        <p>Henüz menünüze ürün eklememişsiniz.</p>
      )}
    </div>
  );
}
