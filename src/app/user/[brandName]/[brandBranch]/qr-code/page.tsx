import { redirect } from "next/navigation";

import { createClient } from "@/src/lib/supabase/server";
import QrCodeClient from "@/src/components/QrCodeClient";
import getUserID from "@/src/lib/getUserID";

export default async function QrCode() {
  const supabase = createClient();
  const userID = await getUserID();

  const { data: username } = await supabase
    .from("users")
    .select("username")
    .eq("id", userID)
    .single();

  if (!username?.username) {
    redirect("/user/user-info");
  }

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <QrCodeClient userID={userID} />
    </div>
  );
}
