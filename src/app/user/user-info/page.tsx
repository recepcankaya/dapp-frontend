"use client";

import addUsername from "@/src/server-actions/user/addUsername";
import { useFormState } from "react-dom";

const errorMessage = {
  message: "",
};
// @todo - Tasarım açısından eksikler var, düzeltilecek.

export default function UserInfo() {
  const [state, formAction] = useFormState(addUsername, errorMessage);

  return (
    <section className="flex justify-center pt-24">
      <form action={formAction} className="flex flex-col justify-center">
        <label
          htmlFor="username"
          className="content-start font-rosarivo text-xl mb-10 mr-[16vh] text-lad-white">
          Kullanıcı Adınız
        </label>
        <input
          type="text"
          name="username"
          id="username"
          className="rounded-full border-2 border-lad-pink bg-black py-1.5 pl-4"
        />
        <p className="text-destructive mt-6">{state?.message}</p>
        <button
          type="submit"
          className="mt-[10vh] mx-4 grow text-lg font-bold font-rosarivo rounded-3xl bg-lad-pink text-lad-black py-2">
          Kaydet
        </button>
      </form>
    </section>
  );
}
