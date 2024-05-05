"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CustomerHomeLinks({
  brandID,
}: {
  brandID: BrandBranch["id"];
}) {
  const pathname = usePathname();

  return (
    <div className="flex justify-around">
      <Link
        href="/user/brands"
        className="text-right text-lg underline decoration-2 underline-offset-2">
        Markalar
      </Link>
      <Link
        href={`${pathname}/qr-code?brandID=${brandID}`}
        className="text-right text-lg underline decoration-2 underline-offset-2">
        Qr Kodu Okut
      </Link>
      <Link
        href={`${pathname}/profile?brandID=${brandID}`}
        className="text-right text-lg underline decoration-2 underline-offset-2">
        Profil
      </Link>
    </div>
  );
}
