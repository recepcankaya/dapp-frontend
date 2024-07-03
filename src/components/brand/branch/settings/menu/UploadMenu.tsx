"use client";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";

import { getShortLengthToastOptions } from "@/src/lib/toastOptions";
import { initialState } from "@/src/lib/productInitialState";
import addMenuProduct from "@/src/server-actions/brand/branch-add-menu-product";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Textarea } from "@/src/components/ui/textarea";
import { AddIcon } from "@/src/components/ui/SVG/Add";
import SubmitButton from "@/src/components/ui/submit-button";

type Props = {
  setMenusArray: React.Dispatch<React.SetStateAction<Menus[]>>;
  categories: Menus["category"][];
};

export default function UploadMenu({ setMenusArray, categories }: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [updateState, formAction] = useFormState(addMenuProduct, initialState);
  const params = useParams<{ "brand-home": string }>();

  useEffect(() => {
    if (updateState?.success === true) {
      setIsDialogOpen(false);
      toast.success(updateState.message, getShortLengthToastOptions());
      setMenusArray((prevMenus) => [...(prevMenus ?? []), updateState.product]);
    }

    if (updateState?.success === false) {
      toast.error(updateState?.message, getShortLengthToastOptions());
    }
  }, [
    updateState.success,
    updateState.message,
    updateState.product,
    setMenusArray,
  ]);

  return (
    <div className="flex justify-center items-center mb-6 relative">
      <div className="ml-auto">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger>
            <AddIcon className="hover:scale-110 transition-all" />
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Ürün Ekle</DialogTitle>
            </DialogHeader>
            <form action={formAction} className="grid gap-2">
              <input
                type="hidden"
                name="branchName"
                value={decodeURI(params["brand-home"])}
              />
              <div>
                <Label htmlFor="name">Ürünün İsmi</Label>
                <Input id="name" name="name" className="bg-[#dbb5b59d]" />
              </div>
              <div>
                <Label htmlFor="price">Ürünün Fiyatı</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  className="bg-[#dbb5b59d]"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Ürünün Açıklaması</Label>
                <Textarea
                  id="description"
                  name="description"
                  className="bg-[#dbb5b59d]"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="image">Ürünün Resmi</Label>
                <Input
                  id="image"
                  name="image"
                  type="file"
                  className="bg-[#dbb5b59d]"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Ürünün Kategorisi</Label>
                <Select name="category">
                  <SelectTrigger className="bg-[#dbb5b59d]">
                    <SelectValue placeholder="Ürün kategorisini seç" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="grid gap-2">
                  <Label htmlFor="image">Yeni Kategori Açmak İçin</Label>
                  <Input
                    id="new-category"
                    name="newCategory"
                    className="bg-[#dbb5b59d]"
                  />
                </div>
              </div>
              <DialogFooter>
                <SubmitButton type="submit" className="mt-8" title="Kaydet" />
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
