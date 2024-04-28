"use server";
import { redirect } from "next/navigation";
import { z } from "zod";

import { createClient } from "@/src/lib/supabase/server";

export default async function login(prevState: any, formData: FormData) {
  const schema = z.object({
    email: z.string().email({
      message: "Geçerli bir e-posta adresi giriniz.",
    }),
    password: z.string().min(8, {
      message: "Şifre en az 8 karakterden oluşmalıdır.",
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

  const { data, error } = await supabase.auth.signInWithPassword({
    email: result.data.email,
    password: result.data.password,
  });

  if (error) {
    return {
      message: "E-posta adresi veya şifre hatalı.",
    };
  }

  const { data: brandInfo, error: brandError } = await supabase
    .from("admins")
    .select("brand_name, brand_branch")
    .eq("id", data.user?.id);

  if (brandError) {
    return {
      message: "Böyle bir marka bulunamadı.",
    };
  } else {
    redirect(
      `/admin/${brandInfo[0].brand_name.toLowerCase()}-${brandInfo[0].brand_branch.toLowerCase()}`
    );
  }
}
