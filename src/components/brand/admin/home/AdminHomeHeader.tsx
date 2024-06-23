"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { logout } from "@/src/lib/logout";
import useScreenSize from "@/src/hooks/useScreenSize";

import { Button } from "@/src/components/ui/button";
import {
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenu,
} from "@/src/components/ui/dropdown-menu";

type AdminHomeHeaderProps = {
  brandName: Brand["brand_name"];
  brandLogo: Brand["brand_logo_url"];
};

export default function AdminHomeHeader({
  brandName,
  brandLogo,
}: AdminHomeHeaderProps) {
  const pathname = usePathname();
  const { containerWidth, setContainerRef } = useScreenSize();

  return (
    <header ref={setContainerRef}>
      <div className="flex items-center justify-around py-4 shadow-md text-[#000101]">
        <div className="flex items-center gap-2">
          <Package2Icon className="h-6 w-6" />
          <p className="text-md sm:text-lg font-semibold text-black">
            {brandName}
          </p>
        </div>
        {containerWidth > 450 && (
          <Button asChild>
            <Link href={`${pathname}/admin-camera`} prefetch={false}>
              Qr Kodu Okut
            </Link>
          </Button>
        )}
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="rounded-full border border-black w-8 h-8"
                size="icon"
                variant="ghost">
                <Image
                  alt="Avatar"
                  className="rounded-full"
                  height="32"
                  src={brandLogo}
                  style={{
                    aspectRatio: "32/32",
                    objectFit: "cover",
                  }}
                  width="32"
                />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-[#d8d0c3]">
              <DropdownMenuLabel>Hesabım</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="hover:cursor-pointer" asChild>
                <Link href={`${pathname}/settings`} prefetch={false}>
                  Ayarlar
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:cursor-pointer" asChild>
                Destek
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={logout}
                className="hover:cursor-pointer"
                asChild>
                <Link href={`/`} prefetch={false}>
                  Çıkış Yap
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {containerWidth <= 450 && (
        <div className="flex justify-center mt-5">
          <Button asChild className="">
            <Link
              href={`${pathname}/admin-camera`}
              className="text-balance"
              prefetch={false}>
              Qr Kodu Okut
            </Link>
          </Button>
        </div>
      )}
    </header>
  );
}

function Package2Icon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#000"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
      <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
      <path d="M12 3v6" />
    </svg>
  );
}
