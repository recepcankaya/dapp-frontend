"use client";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";

import { getShortLengthToastOptions } from "@/src/lib/toastOptions";
import deleteProductFromMenu from "@/src/server-actions/brand/branch-delete-product-from-menu";
import { initialState } from "@/src/lib/productInitialState";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/src/components/ui/alert-dialog";
import { Button } from "@/src/components/ui/button";
import SubmitButton from "@/src/components/ui/submit-button";

type Props = {
  product: {
    branch_id: string | null;
    category: string;
    description: string | null;
    id: string;
    image_url: string | null;
    name: string;
    position: number;
    price: number | null;
  };
  setMenusArray: React.Dispatch<React.SetStateAction<Menus[] | null>>;
};
export default function DeleteMenuItem({ setMenusArray, product }: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const params = useParams<{ "brand-home": string }>();
  const [deleteState, formAction] = useFormState(
    deleteProductFromMenu,
    initialState
  );

  useEffect(() => {
    if (deleteState?.success === true) {
      setIsDialogOpen(false);
      toast.success(deleteState.message, getShortLengthToastOptions());
      setMenusArray(
        (prevMenus) =>
          prevMenus?.filter(
            (product) => product.id !== deleteState.product.id
          ) ?? []
      );
    }

    if (deleteState?.success === false) {
      toast.error(deleteState?.message, getShortLengthToastOptions());
    }
  }, [deleteState, setMenusArray]);

  return (
    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <AlertDialogTrigger asChild>
        <Button className="bg-transparent hover:bg-transparent" size="icon">
          <TrashIcon className="h-5 w-5 text-red-500 hover:scale-110 transition-all" />
          <span className="sr-only">Sil {product.name}</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Ürünü Silmek İstediğinize Emin misiniz?
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-[#D9D9D9]">Vazgeç</AlertDialogCancel>
          <form action={formAction}>
            <input type="hidden" name="productID" value={product.id} />
            <input
              type="hidden"
              name="branchName"
              value={decodeURI(params["brand-home"])}
            />
            <SubmitButton
              type="submit"
              className="bg-[#dbb5b580] text-black hover:bg-[#DBB5B5]"
              title="Devam Et"
            />
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
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
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}
