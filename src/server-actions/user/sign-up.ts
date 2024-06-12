"use server";
import { redirect } from "next/navigation";
import { z } from "zod";

import { createClient } from "@/src/lib/supabase/server";
import { revalidatePath } from "next/cache";

export default async function signUpWithEmail(
  prevState: any,
  formData: FormData
) {
  const schema = z.object({
    email: z.string().email({
      message: "Lütfen geçerli bir email giriniz.",
    }),
    password: z.string().min(8, {
      message: "Şifreniz en az 8 karakterden oluşmalıdır.",
    }),
  });

  const result = schema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!result.success) {
    return { message: result.error.errors[0].message };
  }

  const supabase = createClient();

  const { error } = await supabase.auth.signUp(result.data);

  if (
    !/[a-zA-Z]/.test(result.data.password) ||
    !/\d/.test(result.data.password)
  ) {
    return {
      message: "Şifre en az bir harf ve bir rakam içermelidir.",
    };
  }

  if (error) {
    if (error.message.includes("User already registered")) {
      return {
        message:
          "Bu email adresi kullanımdadır. Lütfen başka bir email adresi giriniz.",
      };
    } else {
      return {
        message:
          "Kayıt oluşturulurken bir hata oluştu. Lütfen tekrar deneyiniz.",
      };
    }
  }

  revalidatePath("/user/sign-up", "page");
  redirect("/user/user-info");
}
