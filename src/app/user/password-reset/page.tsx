"use client";
import { Card, CardContent, CardFooter } from "@/src/components/ui/card";
import { Label } from "@/src/components/ui/label";
import { Input } from "@/src/components/ui/input";
import Link from "next/link";
import SubmitButton from "@/src/components/ui/submit-button";
import {
  FormState,
  changePassword,
} from "@/src/server-actions/user/reset-password";
import { useFormState } from "react-dom";
import { useEffect } from "react";
import { Bounce, ToastOptions, toast } from "react-toastify";

const initialState: FormState = {
  message: "",
  success: undefined,
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

export default function Component() {
  const [state, resetPasswordAction] = useFormState(
    changePassword,
    initialState
  );

  useEffect(() => {
    if (state.success === true) {
      toast.success(state.message, toastOptions);
    }

    if (state.success === false) {
      toast.error(state.message, toastOptions);
    }
  }, [state]);

  return (
    <div className="mx-auto max-w-md space-y-6 pt-24">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Şifreyi Sıfırla</h1>
      </div>
      <Card className="pt-4">
        <form action={resetPasswordAction}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Yeni Şifre</Label>
              <Input
                id="password"
                type="password"
                name="password"
                required
                className="bg-[#dbb5b59d]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password-confirm">Yeni Şifreyi Doğrula</Label>
              <Input
                id="password-confirm"
                type="password"
                name="passwordConfirm"
                required
                className="bg-[#dbb5b59d]"
              />
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton type="submit" className="w-full" title="Sıfırla" />
          </CardFooter>
        </form>
      </Card>
      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        <Link href="/" className="font-medium hover:underline" prefetch={false}>
          Giriş sayfasına
        </Link>
      </div>
    </div>
  );
}
