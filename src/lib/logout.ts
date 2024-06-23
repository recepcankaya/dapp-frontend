import { createClient } from "@/src/lib/supabase/client";

export const logout = async () => {
  const supabase = createClient();
  try {
    await supabase.auth.signOut();
    window.location.reload();
  } catch (error) {
    console.error("Could not sign out", error);
  }
};
