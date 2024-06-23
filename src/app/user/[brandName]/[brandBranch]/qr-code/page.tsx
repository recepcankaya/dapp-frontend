import QrCodeClient from "@/src/components/QrCodeClient";
import getUserID from "@/src/lib/getUserID";

export default async function QrCode() {
  const userID = await getUserID();

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <QrCodeClient userID={userID} />
    </div>
  );
}
