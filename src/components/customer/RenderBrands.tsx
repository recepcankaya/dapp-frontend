"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { haversine } from "@/src/lib/haveresine";
import { Input } from "../ui/input";

type RenderBrandsProps = {
  brands: {
    id: BrandBranch["id"];
    branch_name: BrandBranch["branch_name"];
    coords: BrandBranch["coords"];
    brand: {
      id: Brand["id"];
      brand_name: Brand["brand_name"];
      brand_logo_url: Brand["brand_logo_url"];
    } | null;
  }[];
};

type BrandItem = {
  id: BrandBranch["id"];
  branch_name: BrandBranch["branch_name"];
  coords: BrandBranch["coords"];
  brand: {
    id: Brand["id"];
    brand_name: Brand["brand_name"];
    brand_logo_url: Brand["brand_logo_url"];
  } | null;
};

function convertString(str: string): string {
  return str.toLowerCase().replace(/\s+/g, "-");
}

export default function RenderBrands(brands: RenderBrandsProps) {
  const [customerLocation, setCustomerLocation] = useState<{
    lat: number;
    long: number;
  } | null>(null);
  const [sortedAdmins, setSortedAdmins] = useState<RenderBrandsProps["brands"]>(
    []
  );
  const [searchedAdmin, setSearchedAdmin] = useState<string>("");
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setCustomerLocation({
        lat: position.coords.latitude,
        long: position.coords.longitude,
      });
    });
    window.localStorage.setItem("hasShownCampaignModal", "false");
  }, []);

  useEffect(() => {
    if (!customerLocation || !brands) return;
    const sorted = [...brands.brands].sort((a, b): any => {
      const coordsA =
        typeof a.coords === "string" ? JSON.parse(a.coords) : a.coords;
      const coordsB =
        typeof b.coords === "string" ? JSON.parse(b.coords) : b.coords;
      const distanceA = haversine(
        { lat: customerLocation?.lat, lng: customerLocation?.long },
        { lat: coordsA?.lat, lng: coordsA?.long }
      );
      const distanceB = haversine(
        { lat: customerLocation.lat, lng: customerLocation.long },
        { lat: coordsB?.lat, lng: coordsB?.long }
      );
      return distanceA - distanceB;
    });

    setSortedAdmins(sorted);
  }, [customerLocation, brands]);

  return (
    <div className="w-screen flex flex-col justify-center items-center">
      <Input
        className="mb-12 w-4/5 border-2 border-[#dbb5b5]"
        value={searchedAdmin}
        onChange={(e) => setSearchedAdmin(e.target.value)}
        placeholder="Mekanını ara..."
      />
      <div className="grid grid-cols-2 gap-y-12 gap-x-6">
        {customerLocation
          ? sortedAdmins
              .filter((item) =>
                item?.brand?.brand_name
                  ? item.brand.brand_name
                      .toLowerCase()
                      .includes(searchedAdmin.toLowerCase())
                  : true
              )
              .map((item: BrandItem, index: number) =>
                item.brand === null ? (
                  <div key={index}>Markalar bulunamadı</div>
                ) : (
                  <div
                    key={item.id}
                    className="flex flex-col items-center gap-4"
                  >
                    <Link
                      href={`/user/${convertString(
                        item.brand.brand_name
                      )}/${convertString(item.branch_name)}?brandID=${
                        item.brand.id
                      }&branchID=${item.id}`}
                      prefetch={false}
                    >
                      <Image
                        src={item.brand.brand_logo_url}
                        alt="brand logo"
                        className="rounded-2xl cursor-pointer object-cover border-2 border-lad-pink"
                        key={item.id}
                        quality={100}
                        priority
                        width={100}
                        height={100}
                      />
                    </Link>
                    <p className="text-center text-balance">
                      {item.brand.brand_name}
                    </p>
                  </div>
                )
              )
          : brands.brands
              .filter((item) =>
                item?.brand?.brand_name
                  ? item.brand.brand_name
                      .toLowerCase()
                      .includes(searchedAdmin.toLowerCase())
                  : true
              )
              .map((item: BrandItem, index: number) =>
                item.brand === null ? (
                  <div key={index}>Markalar bulunamadı</div>
                ) : (
                  <div key={index} className="flex flex-col items-center gap-4">
                    <Link
                      href={`/user/${convertString(
                        item.brand.brand_name
                      )}/${convertString(item.branch_name)}?brandID=${
                        item.brand.id
                      }&branchID=${item.id}`}
                      prefetch={false}
                    >
                      <Image
                        src={item.brand.brand_logo_url}
                        alt="brand logo"
                        className="rounded-2xl cursor-pointer object-cover border-2 border-lad-pink"
                        key={index}
                        quality={100}
                        priority
                        width={100}
                        height={100}
                      />
                    </Link>
                    <p>{item.brand.brand_name}</p>
                  </div>
                )
              )}
      </div>
    </div>
  );
}
