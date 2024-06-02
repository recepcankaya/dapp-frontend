"use client";
import Link from "next/link";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/src/components/ui/table";
import { Button } from "@/src/components/ui/button";
import { useEffect, useState } from "react";
import AddMenuItem from "@/src/components/customer/menu/AddMenuItem";
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
import deleteProductFromMenu, {
  FormState,
} from "@/src/server-actions/brand/branch-delete-product-from-menu";
import { useFormState } from "react-dom";

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

const message = {
  success: undefined,
  message: "",
};

export default function BranchMenu({ menu }: Props) {
  const [state, formAction] = useFormState(
    deleteProductFromMenu,
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
    <div className="container mx-auto px-4 md:px-6 py-8 bg-white text-black mt-24">
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
                      <AlertDialog>
                        <AlertDialogTrigger>
                          <Button variant="ghost" size="icon">
                            <TrashIcon className="h-5 w-5 text-red-500" />
                            <span className="sr-only">Sil {product.name}</span>
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
                                name="productID"
                                value={product.id}
                              />
                              {/* <AlertDialogAction>Devam Et</AlertDialogAction> */}
                              <button>Devam Et</button>
                            </form>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
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
