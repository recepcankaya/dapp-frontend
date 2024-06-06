"use client";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogClose,
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
import { Textarea } from "../../ui/textarea";
import { useFormState } from "react-dom";
import addMenuProduct, {
  FormState,
} from "@/src/server-actions/brand/branch-add-menu-product";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const message = {
  success: undefined,
  message: "",
};

type Props = {
  categories: string[];
};

export default function AddMenuItem({ categories }: Props) {
  const params = useParams<{ "brand-home": string }>();
  const [state, formAction] = useFormState(
    addMenuProduct,
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
    <section>
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
      <Dialog>
        <DialogTrigger>
          <Button>Yeni Ürün Ekle</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Ürün Ekle</DialogTitle>
            <DialogDescription>
              Menünüze yeni bir ürün ekleyin.
            </DialogDescription>
          </DialogHeader>
          <form action={formAction} className="grid gap-2">
            <input
              type="hidden"
              name="branchName"
              value={decodeURI(params["brand-home"])}
            />
            <div>
              <Label htmlFor="name">Ürünün İsmi</Label>
              <Input id="name" name="name" />
            </div>
            <div>
              <Label htmlFor="price">Ürünün Fiyatı</Label>
              <Input id="price" name="price" required type="number" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Ürünün Açıklaması</Label>
              <Textarea id="description" name="description" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="image">Ürünün Resmi</Label>
              <Input id="image" name="image" type="file" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Ürünün Kategorisi</Label>
              <Select name="category">
                <SelectTrigger>
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
                <Input id="new-category" name="newCategory" />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Vazgeç
                </Button>
              </DialogClose>
              <Button type="submit">Kaydet</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}
