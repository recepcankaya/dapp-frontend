"use server";
import { redirect } from "next/navigation";

import { createClient } from "./supabase/server";

export default async function getUserID() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  return user?.id;
}
