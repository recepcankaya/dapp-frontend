"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CustomerHomeLinks({ adminId }: { adminId: string }) {
  const pathname = usePathname();

  return (
    <div className="flex justify-around">
      <Link
        href="/user/brands"
        className="text-right text-lg underline decoration-2 underline-offset-2">
        Markalar
      </Link>
      <Link
        href={`${pathname}/qr-code?adminID=${adminId}`}
        className="text-right text-lg underline decoration-2 underline-offset-2">
        Qr Kodu Okut
      </Link>
      <Link
        href={`${pathname}/profile?adminID=${adminId}`}
        className="text-right text-lg underline decoration-2 underline-offset-2">
        Profil
      </Link>
    </div>
  );
}
