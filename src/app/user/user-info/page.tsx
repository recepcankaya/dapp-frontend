"use client";

import { usePathname, useRouter } from "next/navigation";
import { Input } from "@/src/components/ui/input";
import SubmitButton from "@/src/components/ui/submit-button";
import addUsername from "@/src/server-actions/user/addUsername";
import { useFormState } from "react-dom";
import { FormEvent, useEffect, useState } from "react";

const errorMessage = {
  message: "",
};

export default function UserInfo() {
  const [state, formAction] = useFormState(addUsername, errorMessage);
  const router = useRouter();
  const pathname = usePathname();
  const [replaceState, setReplacateState] = useState(false);

  useEffect(() => {
    // Check if the user should be redirected away from the user-info page
    if (pathname.includes("/user/user-info") && replaceState) {
      router.replace("/user/brands");
    }
  }, [router, pathname, replaceState]);

  return (
    <section className="flex justify-center pt-24">
      <form action={formAction} className="flex flex-col justify-center">
        <label
          htmlFor="username"
          className="content-start text-xl mb-10 mr-[16vh]"
        >
          Kullanıcı Adınızı Giriniz:
        </label>
        <Input
          type="text"
          name="username"
          id="username"
          className="bg-[#dbb5b59d]"
        />
        <p className="text-destructive mt-6">{state?.message}</p>
        <SubmitButton
          type="submit"
          className="mt-4"
          title="Kaydet"
          onClick={(e: FormEvent<Element>) => {
            e.preventDefault();
            return new Promise<void>((resolve) => {
              setReplacateState(true);
              resolve();
            });
          }}
        />
      </form>
    </section>
  );
}
