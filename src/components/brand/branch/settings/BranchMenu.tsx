"use client";
import Image from "next/image";

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

import type { CategoryProduct, Product } from "@/src/lib/types/product.types";

type Props = {
  menu: CategoryProduct[] | null;
};

export default function BranchMenu({ menu }: Props) {
  console.log(menu);
  return (
    <div className="container mx-auto px-4 md:px-6 py-8 bg-[#D9D9D9] text-black mt-24">
      <UploadMenu
        categories={
          menu && menu.length > 0
            ? menu.map((item: CategoryProduct) => item.category)
            : []
        }
      />
      {menu && menu?.length > 0 ? (
        menu.map((item: CategoryProduct) => (
          <ul key={item.categoryID} className="mt-12">
            <h2 className="text-xl font-bold mb-4">{item.category}</h2>
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
                  {item.products?.map((product) => (
                    <TableRow
                      key={product.id}
                      className="hover:bg-gray-200 border-none">
                      <TableCell className="p-4">
                        <Image
                          src={product.image}
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
                      <TableCell className="p-4">{product.price}</TableCell>
                      <TableCell className="p-4">
                        <div className="flex gap-2">
                          <EditMenu product={product as Product} />
                          <DeleteMenuItem product={product as Product} />
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
