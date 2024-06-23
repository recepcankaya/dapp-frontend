"use server";
import { RedirectType, redirect } from "next/navigation";
import { z } from "zod";

import { createClient } from "@/src/lib/supabase/server";
import getUserID from "@/src/lib/getUserID";

export default async function addUsername(prevState: any, formData: FormData) {
  const schema = z.object({
    username: z.string().min(2, {
      message: "Kullanıcı adı en az 2 harften oluşmalıdır.",
    }),
  });

  const result = schema.safeParse({ username: formData.get("username") });
  if (!result.success) {
    return { success: false, message: result.error.errors[0].message };
  }
  const supabase = createClient();

  const userID = await getUserID();

  if (!userID) {
    redirect("/");
  }

  const { data: user } = await supabase
    .from("users")
    .select("id, username")
    .eq("id", userID)
    .single();

  let error;
  if (user?.id && !user?.username) {
    ({ error } = await supabase
      .from("users")
      .update({ username: result.data?.username })
      .eq("id", userID));
  } else {
    ({ error } = await supabase.from("users").insert({
      id: userID,
      username: result.data?.username,
    }));
  }

  if (error) {
    if (
      error?.message.includes("duplicate key value violates unique constraint")
    ) {
      return {
        success: false,
        message:
          "Bu kullanıcı adı kullanımdadır. Lütfen başka bir kullanıcı adı seçiniz.",
      };
    } else {
      return {
        success: false,
        message:
          "Kullanıcı adı eklenirken bir hata oluştu. Lütfen tekrar deneyiniz.",
      };
    }
  } else {
    return {
      success: true,
      message: "",
    };
  }
}
