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
    .from("brand")
    .select("brand_name")
    .eq("id", data.user?.id)
    .single();

  if (!brandError) {
    const brandName = encodeURIComponent(brandInfo.brand_name.toLowerCase());
    redirect(`/brand/admin/${brandName}/`.replace(/%20/g, "-"));
  } else {
    const { data: branchInfo, error: branchError } = await supabase
      .from("brand_branch")
      .select(
        `
      branch_name,
      brand (
        brand_name
      )
      `
      )
      .eq("id", data.user?.id)
      .single();

    if (!branchError) {
      const brandName = encodeURIComponent(
        String(branchInfo.brand?.brand_name.toLowerCase())
      );
      const brandBranch = encodeURIComponent(
        branchInfo.branch_name.toLowerCase()
      );
      redirect(`/brand/${brandName}-${brandBranch}/`.replace(/%20/g, "-"))  ;
    } else {
      return {
        message: "Böyle bir marka bulunamadı.",
      };
    }
  }
}
