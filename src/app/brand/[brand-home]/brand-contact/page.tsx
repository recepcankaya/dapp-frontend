"use client";

import sendMail from "@/src/server-actions/admin/sendContactMail";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFormState, useFormStatus } from "react-dom";
import { useEffect } from "react";
import { shortLengthToastOptions } from "@/src/lib/toastOptions";

export default function BranchContact() {
  const [state, formAction] = useFormState(sendMail, undefined);

  function Submit() {
    const { pending } = useFormStatus();
    return (
      <button
        type="submit"
        className="text-white bg-black rounded p-3"
        disabled={pending}>
        {pending ? "Gönderiliyor..." : "Gönder"}
      </button>
    );
  }

  useEffect(() => {
    if (state?.success === true) {
      toast.success(state?.message, shortLengthToastOptions);
    }

    if (state?.success === false) {
      toast.error(state?.message, shortLengthToastOptions);
    }
  }, [state]);
  return (
    <>
      <div className="flex items-center justify-center min-h-screen ">
        <div className="rounded p-5 bg-white flex flex-col w-4/5 shadow-2xl">
          <form className="flex flex-col space-y-5" action={formAction}>
            <div className="flex flex-col gap-y-2">
              <label className="text-stone-950">E-mail</label>
              <input
                type="email"
                name="senderEmail"
                className="text-stone-950 border-2"></input>
            </div>
            <div className="flex flex-col gap-y-2">
              <label className="text-stone-950">İşletme Adı</label>
              <input
                type="textarea"
                name="brandName"
                className="text-stone-950 border-2"></input>
            </div>
            <div className="flex flex-col gap-y-2">
              <label className="text-stone-950">Şube</label>
              <input
                type="textarea"
                name="branchName"
                className="text-stone-950 border-2"></input>
            </div>
            <div className="flex flex-col gap-y-2">
              <label className="text-stone-950">Başlık</label>
              <input
                type="textarea"
                name="title"
                className="text-stone-950 border-2"></input>
            </div>
            <div className="flex flex-col gap-y-2">
              <label className="text-stone-950">Mesajınız</label>
              <textarea
                className="h-[200px] overflow-auto text-stone-950 resize-none border-2"
                name="message"></textarea>
            </div>
            <div className="flex justify-end">
              <Submit />
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
