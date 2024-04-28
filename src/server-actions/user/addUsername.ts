"use server";
import { redirect } from "next/navigation";
import { z } from "zod";

import { createClient } from "@/src/lib/supabase/server";
import getUserID from "@/src/lib/supabase/getUserID";

export default async function addUsername(prevState: any, formData: FormData) {
  const schema = z.object({
    username: z.string().min(2, {
      message: "Kullanıcı adı en az 2 harften oluşmalıdır.",
    }),
  });

  const result = schema.safeParse({ username: formData.get("username") });
  if (!result.success) {
    return { message: result.error.errors[0].message };
  }
  const supabase = createClient();

  const userID = await getUserID();
  const { error } = await supabase
    .from("users")
    .update({ username: result.data?.username, last_login: new Date() })
    .eq("id", userID);
  if (
    error?.message.includes("duplicate key value violates unique constraint")
  ) {
    return {
      message: "Bu kullanıcı adı kullanımdadır.",
    };
  } else {
    redirect("/user/brands");
  }
}