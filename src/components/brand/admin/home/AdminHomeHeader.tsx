"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
  brandLogo: Brand["brand_logo_ipfs_url"];
};

export default function AdminHomeHeader({
  brandName,
  brandLogo,
}: AdminHomeHeaderProps) {
  const pathname = usePathname();

  return (
    <header className="flex items-center justify-between px-8 py-4 shadow-md text-[#000101]">
      <div className="flex items-center gap-4">
        <Package2Icon className="h-6 w-6" />
        <div className="text-lg font-semibold text-black">{brandName}</div>
      </div>
      <Button asChild className="">
        <Link href={`${pathname}/admin-camera`}>Qr Kodu Okut</Link>
      </Button>
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
                src={
                  brandLogo
                    ? brandLogo.replace("ipfs://", "https://ipfs.io/ipfs/")
                    : ""
                }
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
            <DropdownMenuItem className="hover:cursor-pointer">
              Ayarlar
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:cursor-pointer">
              Destek
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="hover:cursor-pointer">
              Çıkış Yap
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
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
