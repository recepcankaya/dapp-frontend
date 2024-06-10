"use server";
import { z } from "zod";
import { revalidatePath } from "next/cache";

import { createClient } from "@/src/lib/supabase/server";
import { redirect } from "next/navigation";

export type FormState = {
  message: string;
  success: unknown;
};

export async function changePassword(prevState: any, formData: FormData) {
  const schema = z.object({
    password: z.string().min(8, {
      message: "Şifre en az 8 karakterden oluşmalıdır.",
    }),
    passwordConfirm: z
      .string()
      .min(8, {
        message: "Şifre en az 8 karakterden oluşmalıdır.",
      })
      .refine((data) => data === formData.get("password"), {
        message: "Lütfen aynı şifreyi giriniz.",
      }),
  });

  const result = schema.safeParse({
    password: formData.get("password"),
    passwordConfirm: formData.get("passwordConfirm"),
  });

  if (result.error) {
    return {
      success: false,
      message: result.error.errors[0].message,
    };
  }

  if (
    !/[a-zA-Z]/.test(result.data.password) ||
    !/\d/.test(result.data.password)
  ) {
    return {
      success: false,
      message: "Şifre en az bir harf ve bir rakam içermelidir.",
    };
  }

  const supabase = createClient();
  const { error } = await supabase.auth.updateUser({
    password: result.data.passwordConfirm,
  });
  if (error) {
    if (
      error.message ===
      "New password should be different from the old password."
    ) {
      return {
        success: false,
        message: "Yeni şifreniz eski şifrenizden farklı olmalıdır.",
      };
    } else {
      return {
        success: false,
        message: `Şifre değiştirilemedi. Lütfen tekrar deneyiniz.`,
      };
    }
  } else {
    revalidatePath("/brand/admin/[admin-home]/settings", "page");
    redirect("/");
    return {
      success: true,
      message: "Şifreniz başarıyla değiştirilmiştir.",
    };
  }
}
