"use client";
import { useFormState } from "react-dom";

import login from "@/src/server-actions/admin/login";
import SubmitButton from "@/src/components/ui/submit-button";

const errorMessage = {
  message: "",
};

export default function AdminLogin() {
  const [state, formAction] = useFormState(login, errorMessage);

  return (
    <section className="flex justify-center pt-24">
      <form action={formAction} className="flex flex-col justify-center">
        <label htmlFor="email" className="content-start text-xl mb-6 mr-[16vh]">
          Mailiniz
        </label>
        <input
          type="email"
          name="email"
          id="email"
          className="rounded-full border-2 border-lad-pink py-1.5 pl-4"
        />
        <label
          htmlFor="password"
          className="content-start text-xl mb-6 mt-14 mr-[16vh]">
          Şifreniz
        </label>
        <input
          type="password"
          name="password"
          id="password"
          className="rounded-full border-2 border-lad-pink py-1.5 pl-4"
        />
        <p className="text-destructive mt-6">{state?.message}</p>
        <SubmitButton
          type="submit"
          className="rounded-xl mx-4 grow text-lg font-bold "
          title="Giriş Yap"
        />
      </form>
    </section>
  );
}
