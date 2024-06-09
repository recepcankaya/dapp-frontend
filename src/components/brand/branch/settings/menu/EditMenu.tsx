"use client";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { Label } from "@/src/components/ui/label";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { useFormState } from "react-dom";
import editMenuProduct, {
  FormState as EditFormState,
} from "@/src/server-actions/brand/branch-edit-product";
import { useEffect, useState } from "react";
import { Bounce, ToastOptions, toast } from "react-toastify";
import SubmitButton from "@/src/components/ui/submit-button";

const message = {
  success: undefined,
  message: "",
};

type Product = {
  name: string;
  price: string;
  description: string;
  image: string;
  id: string;
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

export default function EditMenu({ product }: { product: Product }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editState, editProductFormAction] = useFormState(
    editMenuProduct,
    message as EditFormState
  );

  useEffect(() => {
    if (editState?.success === true) {
      setIsDialogOpen(false);
      toast.success(editState.message, toastOptions);
    }

    if (editState?.success === false) {
      toast.error(editState?.message, toastOptions);
    }
  }, [editState]);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="bg-transparent hover:bg-transparent" size="icon">
          <EditIcon className="h-5 w-5 text-blue-500 hover:scale-110 transition-all" />
          <span className="sr-only">Düzenle {product.name}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form action={editProductFormAction}>
          <DialogHeader>
            <DialogTitle className="mb-8">Ürününüzü Güncelleyin</DialogTitle>
          </DialogHeader>
          <div className="grid gap-2">
            <input type="hidden" name="productID" value={product.id} />
            <div>
              <Label htmlFor="edit-price">Ürünün Yeni Fiyatı</Label>
              <Input
                id="edit-price"
                name="editPrice"
                type="number"
                defaultValue={product.price.split(" ")[0]}
                className="bg-[#dbb5b59d]"
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Ürünün Yeni Açıklaması</Label>
              <Input
                id="edit-description"
                name="editDescription"
                defaultValue={product.description}
                className="bg-[#dbb5b59d]"
              />
            </div>
          </div>
          <DialogFooter>
            <SubmitButton type="submit" className="mt-8" title="Devam Et" />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function EditIcon(props: React.SVGProps<SVGSVGElement>) {
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