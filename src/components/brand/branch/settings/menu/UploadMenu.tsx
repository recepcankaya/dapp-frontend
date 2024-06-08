"use client";
import { toast, Bounce, ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
import { useFormState } from "react-dom";
import addMenuProduct, {
  FormState,
} from "@/src/server-actions/brand/branch-add-menu-product";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import SubmitButton from "@/src/components/ui/submit-button";
import { AddIcon } from "../campaigns/UploadCampaign";

const message = {
  success: undefined,
  message: "",
};

type Props = {
  categories: string[];
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

export default function UploadMenu({ categories }: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const params = useParams<{ "brand-home": string }>();
  const [state, formAction] = useFormState(
    addMenuProduct,
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
    <div className="flex justify-center items-center mb-6 relative">
      <h1 className="text-2xl font-bold underline underline-offset-4 absolute left-1/2 transform -translate-x-1/2">
        Menü Yönetimi
      </h1>
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
