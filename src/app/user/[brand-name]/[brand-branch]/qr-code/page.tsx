import QrCodeClient from "@/src/components/QrCodeClient";
import { createClient } from "@/src/lib/supabase/server";

export default async function QrCode() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className=" w-screen h-screen flex justify-center items-center bg-lad-white">
      <QrCodeClient userID={user?.id} />
    </div>
  );
}
