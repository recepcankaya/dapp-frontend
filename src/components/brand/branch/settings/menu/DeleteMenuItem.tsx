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
import { BranchMenuTrashIcon } from "@/src/components/ui/SVG/Trash";

type Props = {
  product: Menus;
  setMenusArray: React.Dispatch<React.SetStateAction<Menus[]>>;
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
          <BranchMenuTrashIcon className="h-5 w-5 text-red-500 hover:scale-110 transition-all" />
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
