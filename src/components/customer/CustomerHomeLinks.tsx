"use client";
import Link from "next/link";

export default function CustomerHomeLinks({
  username,
  adminId,
}: {
  username: string;
  adminId: string;
}) {
  return (
    <div className="flex justify-around">
      <Link
        href="/user/brands"
        className="text-right text-lg mr-8 underline decoration-2 underline-offset-2">
        Markalar
      </Link>
      <Link
        href="/user/qr-code"
        className="text-right text-lg mr-8 underline decoration-2 underline-offset-2">
        Qr Kodu Okut
      </Link>
      <Link
        href={`/user/${username}/profile?admin=${adminId}`}
        className="text-right text-lg mr-8 underline decoration-2 underline-offset-2">
        Profil
      </Link>
    </div>
  );
}
