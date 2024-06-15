"use client";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import Link from "next/link";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { createClient } from "../lib/supabase/client";
import { getShortLengthToastOptions } from "../lib/toastOptions";
import loginWithEmail from "../server-actions/user/login";

import { Button } from "@/src/components/ui/button";
import { Label } from "@/src/components/ui/label";
import { Input } from "@/src/components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import SubmitButton from "../components/ui/submit-button";

const message = {
  message: "",
};

export default function Home() {
  const [mail, setMail] = useState("");
  const [state, loginEmailAction] = useFormState(loginWithEmail, message);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    if (state?.message.length > 0) {
      toast.error(state.message);
    }
  }, [state]);

  const handleLoginWithGoogle = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/user/brands`,
      },
    });
  };

  const sendPasswordRecoveryMail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(mail, {
      redirectTo: "https://www.ladderit.app/user/password-reset",
    });
    setLoading(false);
    if (error) {
      toast.error(
        "Bir hata oluştu, lütfen tekrar deneyin.",
        getShortLengthToastOptions()
      );
      return;
    } else {
      toast.success(
        "Şifre sıfırlama maili gönderildi.",
        getShortLengthToastOptions()
      );
    }
  };

  return (
    <section className="flex flex-col min-h-screen items-center justify-center bg-[length:100%_100%]">
      <div className="mx-auto w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-lg dark:bg-gray-950">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Tekrar Hoşgeldin!</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Giriş yapmak için lütfen bilgilerinizi giriniz.
          </p>
        </div>
        <div className="space-y-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={handleLoginWithGoogle}>
            <ChromeIcon className="mr-2 h-5 w-5" />
            Google ile Giriş Yap
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500 dark:bg-gray-950 dark:text-gray-400">
                Veya
              </span>
            </div>
          </div>
          <form className="space-y-4" action={loginEmailAction}>
            <div className="space-y-2">
              <Label htmlFor="email">Mailiniz</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Şifreniz</Label>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="text-sm font-medium underline underline-offset-2 text-black bg-transparent hover:bg-transparent">
                      Şifreni mi unuttun?
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Şifre sıfırlama maili gönder</DialogTitle>
                      <DialogDescription>
                        Sistemde kayıtlı olan mail adresinizi girerek şifrenizi
                        sıfırlayın
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center space-x-2">
                      <div className="grid flex-1 gap-2">
                        <Label htmlFor="mail" className="sr-only">
                          Mailiniz
                        </Label>
                        <Input
                          id="mail"
                          type="email"
                          name="mail"
                          className="bg-[#dbb5b59d]"
                          value={mail}
                          onChange={(e) => setMail(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter className="sm:justify-end">
                      <DialogClose asChild>
                        <Button
                          type="submit"
                          className="mt-4"
                          onClick={sendPasswordRecoveryMail}>
                          {loading ? (
                            <div className="w-6 h-6 animate-spin rounded-full border-b-2 border-white"></div>
                          ) : (
                            "Gönder"
                          )}
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <Input id="password" type="password" name="password" required />
            </div>
            <SubmitButton type="submit" className="w-full" title="Giriş Yap" />
          </form>
        </div>
        <div className="mt-4 text-center text-sm">
          Hesabın yok mu?
          <Link
            href="/user/sign-up"
            className="font-medium underline underline-offset-2 hover:text-gray-900 dark:hover:text-gray-50"
            prefetch={false}>
            {" "}
            Kayıt ol!
          </Link>
        </div>
      </div>
      <button className="mt-8">
        <Link href="/brand/brand-login" className="text-lg" prefetch={false}>
          Üye İş Yeriyseniz Giriş Yapmak için <br />
          <span className="bg-gradient-to-r from-lad-purple to-lad-green inline-block text-transparent bg-clip-text">
            Tıklayınız
          </span>
        </Link>
      </button>
    </section>
  );
}

function ChromeIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
      <line x1="21.17" x2="12" y1="8" y2="8" />
      <line x1="3.95" x2="8.54" y1="6.06" y2="14" />
      <line x1="10.88" x2="15.46" y1="21.94" y2="14" />
    </svg>
  );
}
