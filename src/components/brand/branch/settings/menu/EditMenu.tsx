"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useFormState } from "react-dom";
import { toast } from "react-toastify";

import { getShortLengthToastOptions } from "@/src/lib/toastOptions";
import editMenuProduct from "@/src/server-actions/brand/branch-edit-product";
import { initialState } from "@/src/lib/productInitialState";
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
import SubmitButton from "@/src/components/ui/submit-button";
import { EditIcon } from "@/src/components/ui/SVG/Edit";

type Props = {
  product: Menus;
  setMenusArray: React.Dispatch<React.SetStateAction<Menus[]>>;
};
export default function EditMenu({ setMenusArray, product }: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editState, editProductFormAction] = useFormState(
    editMenuProduct,
    initialState
  );
  const params = useParams<{ "brand-home": string }>();

  useEffect(() => {
    if (editState?.success === true) {
      setIsDialogOpen(false);
      toast.success(editState.message, getShortLengthToastOptions());
      setMenusArray((prev) => {
        const findProduct = prev.find((item) => item.id === product.id);
        if (findProduct) {
          findProduct.price = editState.product.price;
          findProduct.description = editState.product.description;
          findProduct.image_url = editState.product.image_url;
        }
        return [...prev];
      });
    }

    if (editState?.success === false) {
      toast.error(editState?.message, getShortLengthToastOptions());
    }
  }, [editState, setMenusArray, product]);

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
            <input
              type="hidden"
              name="branchName"
              value={decodeURI(params["brand-home"])}
            />
            <input type="hidden" name="name" value={product.name} />
            <div>
              <Label htmlFor="edit-price">Ürünün Yeni Fiyatı</Label>
              <Input
                id="edit-price"
                name="editPrice"
                type="number"
                defaultValue={product.price!}
                className="bg-[#dbb5b59d]"
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Ürünün Yeni Açıklaması</Label>
              <Input
                id="edit-description"
                name="editDescription"
                defaultValue={product.description!}
                className="bg-[#dbb5b59d]"
              />
            </div>
            <div>
              <Label htmlFor="edit-image">Ürünün Yeni Resmi</Label>
              <Input
                type="file"
                id="edit-image"
                name="editImage"
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
