"use client";
import Image from "next/image";
import { useState, useEffect } from "react";

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
import { Input } from "@/src/components/ui/input";

type BranchMenuProps = {
  menus: Menus[];
  branchID: BrandBranch["id"];
};

export default function BranchMenu({ menus, branchID }: BranchMenuProps) {
  const [menusArray, setMenusArray] = useState<Menus[]>([...menus]);
  const [draggedProductIndex, setDraggedProductIndex] = useState<number | null>(
    null
  );
  const [replacedProductIndex, setReplacedProductIndex] = useState<
    number | null
  >(null);
  const [categoryNames, setCategoryNames] = useState<Record<string, string>>(
    {}
  );
  const [changingCategory, setChangingCategory] = useState<string | null>(null);
  const [category, setCategory] = useState<Menus["category"]>("");
  const supabase = createClient();
  const categories = Array.from(
    new Set(menusArray.map((item) => item.category))
  );

  useEffect(() => {
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      window.scrollBy(0, e.movementY);
    };

    window.addEventListener("dragover", handleDragOver);

    return () => {
      window.removeEventListener("dragover", handleDragOver);
    };
  }, []);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedProductIndex(index);
  };

  const handleDragEnter = (
    e: React.DragEvent,
    index: number,
    category: Menus["category"]
  ) => {
    setReplacedProductIndex(index);
    setCategory(category);
  };

  const handleDragEnd = async (e: React.DragEvent, productID: Menus["id"]) => {
    if (draggedProductIndex !== null && replacedProductIndex !== null) {
      if (draggedProductIndex === replacedProductIndex) {
        return;
      }

      if (draggedProductIndex > replacedProductIndex) {
        const { data: draggedProductPositionUpdated, error } = await supabase
          .from("menus")
          .update({
            position: replacedProductIndex,
            category: category,
          })
          .eq("id", productID)
          .select("category")
          .single();

        if (draggedProductPositionUpdated!.category !== category) {
          await supabase
            .from("menus")
            .update({
              category: category,
            })
            .eq("id", productID);
        }

        const { data: positions } = await supabase
          .from("menus")
          .select("position, id")
          .eq("branch_id", branchID)
          .gte("position", replacedProductIndex)
          .lt("position", draggedProductIndex);

        for (let i = 0; i < positions!.length; i++) {
          if (positions![i].id !== productID) {
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
        const { data: draggedProductPositionUpdated, error } = await supabase
          .from("menus")
          .update({
            position: replacedProductIndex,
            category: category,
          })
          .eq("id", productID)
          .select("category")
          .single();

        const { data: positions } = await supabase
          .from("menus")
          .select("position, id")
          .eq("branch_id", branchID)
          .lte("position", replacedProductIndex)
          .gt("position", draggedProductIndex);

        for (let i = 0; i < positions!.length; i++) {
          if (positions![i].id !== productID) {
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

  const calculateStartingIndex = (currentCategory: Menus["category"]) => {
    let startIndex = 0;
    for (const category of categories) {
      if (category === currentCategory) break;
      startIndex += menusArray.filter(
        (menu) => menu.category === category
      ).length;
    }
    return startIndex;
  };

  const handleChangingCategoryName = async (
    e: React.KeyboardEvent<HTMLInputElement>,
    category: Menus["category"]
  ) => {
    if (e.key === "Enter") {
      await supabase
        .from("menus")
        .update({
          category: categoryNames[category],
        })
        .eq("category", category);

      setMenusArray((prevMenus) =>
        prevMenus.map((menu) =>
          menu.category === category
            ? { ...menu, category: categoryNames[category] }
            : menu
        )
      );

      setChangingCategory(null);
    }
  };

  return (
    <div>
      <UploadMenu setMenusArray={setMenusArray} categories={categories} />
      {categories.map((category) => {
        const startingIndex = calculateStartingIndex(category);
        return (
          <div key={category} className="mt-12">
            {changingCategory === category ? (
              <Input
                onChange={(e) => {
                  setCategoryNames({
                    ...categoryNames,
                    [category]: e.target.value,
                  });
                }}
                value={categoryNames[category] || category}
                onKeyDown={(e) => handleChangingCategoryName(e, category)}
                className="w-1/4"
              />
            ) : (
              <h2
                className="text-xl font-bold mb-4 cursor-pointer"
                onClick={() => {
                  setChangingCategory(category);
                  setCategoryNames({
                    ...categoryNames,
                    [category]: category,
                  });
                }}>
                {categoryNames[category] || category}
              </h2>
            )}
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
                    .map((product: Menus, index: number) => {
                      const globalIndex = startingIndex + index;
                      return (
                        <TableRow
                          draggable
                          onDragStart={(e) => handleDragStart(e, globalIndex)}
                          onDragEnter={(e) =>
                            handleDragEnter(e, globalIndex, category)
                          }
                          onDragEnd={(e) => handleDragEnd(e, product.id)}
                          key={product.id}
                          className="hover:bg-gray-200 border-none">
                          <TableCell className="p-4">
                            {product.image_url ? (
                              <Image
                                src={product.image_url}
                                alt={product.name}
                                width={64}
                                height={64}
                                className="rounded-md object-cover"
                              />
                            ) : (
                              <div></div>
                            )}
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
                      );
                    })}
                </TableBody>
              </Table>
            </div>
          </div>
        );
      })}
    </div>
  );
}
