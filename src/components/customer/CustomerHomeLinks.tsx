"use client";

import useUserStore from "@/src/store/userStore";
import Link from "next/link";

export default function CustomerHomeLinks() {
  const username = useUserStore((state) => state.user.username);

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
        href={`/${username}/profile`}
        className="text-right text-lg mr-8 underline decoration-2 underline-offset-2">
        Profil
      </Link>
    </div>
  );
}
