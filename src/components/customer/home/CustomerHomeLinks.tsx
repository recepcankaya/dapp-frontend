"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CustomerHomeLinks({
  brandID,
  branchID,
}: {
  brandID: BrandBranch["id"];
  branchID: BrandBranch["id"];
}) {
  const pathname = usePathname();

  return (
    <div className="flex justify-around">
      <Link
        href="/user/brands"
        className="text-right text-lg underline decoration-2 underline-offset-2"
        prefetch={false}>
        Markalar
      </Link>
      <Link
        href={`${pathname}/qr-code?brandID=${brandID}&branchID=${branchID}`}
        className="text-right text-lg underline decoration-2 underline-offset-2"
        prefetch={false}>
        Qr Kodu Okut
      </Link>
      <Link
        href={`${pathname}/profile?brandID=${brandID}&branchID=${branchID}`}
        className="text-right text-lg underline decoration-2 underline-offset-2"
        prefetch={false}>
        Profil
      </Link>
    </div>
  );
}
