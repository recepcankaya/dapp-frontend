import Link from "next/link";

export default async function CustomerHomeLinks({
  username,
  adminId,
}: {
  username: string;
  adminId: string;
}) {
  return (
    <div className="flex justify-around">
      <Link
        href="/brands"
        className="text-right text-lg mr-8 underline decoration-2 underline-offset-2">
        Markalar
      </Link>
      <Link
        href="/qr-code"
        className="text-right text-lg mr-8 underline decoration-2 underline-offset-2">
        Qr Kodu Okut
      </Link>
      <Link
        href={`/${username}/profile?admin=${adminId}`}
        className="text-right text-lg mr-8 underline decoration-2 underline-offset-2">
        Profil
      </Link>
    </div>
  );
}
