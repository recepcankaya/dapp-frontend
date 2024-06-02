"use client";
import Link from "next/link";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/src/components/ui/table";
import { Button } from "@/src/components/ui/button";
import { useState } from "react";
import AddMenuItem from "@/src/components/customer/menu/AddMenuItem";

type Product = {
  name: string;
  price: number;
  description: string;
  image: string;
  id: string;
};

type CategoryProduct = {
  category: string;
  categoryID: string;
  products: Product[];
};

type Props = {
  menu: CategoryProduct[];
};

export default function BranchMenu({ menu }: Props) {
  const handleDelete = (id: number) => {
    return;
  };

  const handleEdit = (product: Product) => {
    return;
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 bg-white text-black mt-24">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Menü Yönetimi</h1>
        <AddMenuItem
          categories={menu.map((item: CategoryProduct) => item.category)}
        />
      </div>
      {menu.map((item: CategoryProduct) => (
        <ul key={item.categoryID} className="mt-12">
          <h2 className="text-xl font-bold mb-4">{item.category}</h2>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/4 p-4">Ürünün Resmi</TableHead>
                  <TableHead className="w-1/4 p-4">Ürünün Adı</TableHead>
                  <TableHead className="w-1/2 p-4">Ürünün Açıklaması</TableHead>
                  <TableHead className="w-1/4 p-4">
                    Ürün İçin Aksiyonlar
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {item.products.map((product) => (
                  <TableRow key={product.id} className="hover:bg-gray-100">
                    <TableCell className="p-4">
                      <img
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
                    <TableCell className="p-4">{product.description}</TableCell>
                    <TableCell className="p-4">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(product)}>
                          <DeleteIcon className="h-5 w-5 text-gray-500" />
                          <span className="sr-only">Edit {product.name}</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(+product.id)}>
                          <TrashIcon className="h-5 w-5 text-red-500" />
                          <span className="sr-only">Delete {product.name}</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </ul>
      ))}
    </div>
  );
}

function DeleteIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M20 5H9l-7 7 7 7h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Z" />
      <line x1="18" x2="12" y1="9" y2="15" />
      <line x1="12" x2="18" y1="9" y2="15" />
    </svg>
  );
}

function TrashIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}
