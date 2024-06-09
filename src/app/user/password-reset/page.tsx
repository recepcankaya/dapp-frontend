"use client";
import { Card, CardContent, CardFooter } from "@/src/components/ui/card";
import { Label } from "@/src/components/ui/label";
import { Input } from "@/src/components/ui/input";
import Link from "next/link";
import SubmitButton from "@/src/components/ui/submit-button";
import { changePassword } from "@/src/server-actions/user/reset-password";
import { useFormState } from "react-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { initialState } from "@/src/lib/feedbackForForms";
import { shortLengthToastOptions } from "@/src/lib/toastOptions";

export default function Component() {
  const [state, resetPasswordAction] = useFormState(
    changePassword,
    initialState
  );

  useEffect(() => {
    if (state.success === true) {
      toast.success(state.message, shortLengthToastOptions);
    }

    if (state.success === false) {
      toast.error(state.message, shortLengthToastOptions);
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
          Giriş sayfasına Dön
        </Link>
      </div>
    </div>
  );
}
