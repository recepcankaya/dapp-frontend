"use server";

import { createClient } from "./server";

export default async function getUserID() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user?.id;
}
