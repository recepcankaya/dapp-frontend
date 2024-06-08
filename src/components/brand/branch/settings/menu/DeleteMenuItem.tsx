"use client";
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
import { Button } from "@/src/components/ui/button";
import deleteProductFromMenu, {
  FormState,
} from "@/src/server-actions/brand/branch-delete-product-from-menu";
import { useFormState } from "react-dom";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast, Bounce, ToastOptions } from "react-toastify";
import SubmitButton from "@/src/components/ui/submit-button";

type Product = {
  name: string;
  price: string;
  description: string;
  image: string;
  id: string;
};

const message = {
  success: undefined,
  message: "",
};

const toastOptions: ToastOptions = {
  position: "top-right",
  autoClose: 1500,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light",
  transition: Bounce,
};

export default function DeleteMenuItem({ product }: { product: Product }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const params = useParams<{ "brand-home": string }>();
  const [state, formAction] = useFormState(
    deleteProductFromMenu,
    message as FormState
  );

  useEffect(() => {
    if (state?.success === true) {
      setIsDialogOpen(false);
      toast.success(state.message, toastOptions);
    }

    if (state?.success === false) {
      toast.error(state?.message, toastOptions);
    }
  }, [state]);

  return (
    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <AlertDialogTrigger>
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
      strokeLinejoin="round">
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}
