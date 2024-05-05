import { redirect } from "next/navigation";

import { createClient } from "@/src/lib/supabase/server";
import QrCodeClient from "@/src/components/QrCodeClient";

export default async function QrCode() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-lad-white">
      <QrCodeClient userID={user?.id} />
    </div>
  );
}
