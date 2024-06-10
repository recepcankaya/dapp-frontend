"use client";
import { useEffect } from "react";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { createClient } from "@/src/lib/supabase/client";
import { shortLengthToastOptions } from "@/src/lib/toastOptions";
import signUpWithEmail from "@/src/server-actions/user/sign-up";

import { Button } from "@/src/components/ui/button";
import { Label } from "@/src/components/ui/label";
import { Input } from "@/src/components/ui/input";
import SubmitButton from "@/src/components/ui/submit-button";

const message = {
  message: "",
};

export default function SignUp() {
  const [state, signupEmailAction] = useFormState(signUpWithEmail, message);
  const router = useRouter();

  useEffect(() => {
    if (state?.message.length > 0) {
      toast.error(state.message, shortLengthToastOptions);
    }
    // @todo - Eğer message.length < 0 ise başarılı olduğu anlamına gelir ve serverda redirect ile burada
    // router.replace() kullanalım
  }, [state]);

  const handleLoginWithGoogle = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "https://www.ladderit.app/auth/callback?next=/user/brands",
      },
    });
  };

  return (
    <section className="flex flex-col min-h-screen items-center justify-center bg-[length:100%_100%]">
      <div className="mx-auto w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-lg dark:bg-gray-950">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Hoşgeldin!</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Kayıt olmak için lütfen gerekli bilgileri giriniz.
          </p>
        </div>
        <div className="space-y-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={handleLoginWithGoogle}>
            <ChromeIcon className="mr-2 h-5 w-5" />
            Google ile Kayıt Ol
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
          <form className="space-y-4" action={signupEmailAction}>
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
              <Label htmlFor="password">Şifreniz</Label>
              <Input id="password" type="password" name="password" required />
            </div>
            <SubmitButton type="submit" className="w-full" title="Kayıt Ol" />
          </form>
        </div>
        <p className="text-black-300 text-xs">
          Devam ederek{" "}
          <Link
            href="/terms-of-use"
            className="text-blue-500 underline"
            prefetch={false}>
            üyelik sözleşmesi ve kullanım koşullarını <br />
          </Link>{" "}
          kabul etmiş olursunuz.
        </p>
      </div>
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
