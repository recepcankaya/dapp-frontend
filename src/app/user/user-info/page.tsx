"use client";
import { useEffect } from "react";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";

import addUsername from "@/src/server-actions/user/addUsername";
import { initialState } from "@/src/lib/feedbackForForms";
import { Input } from "@/src/components/ui/input";
import SubmitButton from "@/src/components/ui/submit-button";

export default function UserInfo() {
  const [state, formAction] = useFormState(addUsername, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state.success === true) {
      router.replace("/user/brands");
    }
  }, [router, state]);

  return (
    <section className="flex justify-center pt-24">
      <form action={formAction} className="flex flex-col justify-center">
        <label
          htmlFor="username"
          className="content-start text-xl mb-10 mr-[16vh]">
          Kullanıcı Adınızı Giriniz:
        </label>
        <Input
          type="text"
          name="username"
          id="username"
          className="bg-[#dbb5b59d]"
        />
        <p className="text-destructive mt-6">{state?.message}</p>
        <SubmitButton type="submit" className="mt-4" title="Kaydet" />
      </form>
    </section>
  );
}
