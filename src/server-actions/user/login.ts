"use server";
import { redirect } from "next/navigation";
import { z } from "zod";

import { createClient } from "@/src/lib/supabase/server";
import { revalidatePath } from "next/cache";

export default async function loginWithEmail(
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

  const { error } = await supabase.auth.signInWithPassword(result.data);

  if (error) {
    return {
      message: "Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyiniz.",
    };
  }

  revalidatePath("/", "layout");
  redirect("/user/brands");
}
