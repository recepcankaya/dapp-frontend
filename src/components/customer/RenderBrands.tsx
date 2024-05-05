"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { haversine } from "@/src/lib/haveresine";
import { Input } from "../ui/input";

// @todo - DAHA İYİ BİR TYPE SAFETY KONTROLÜ
type RenderBrandsProps = {
  brands: {
    id: Brand["id"];
    brand_name: Brand["brand_name"];
    brand_logo_ipfs_url: Brand["brand_logo_ipfs_url"];
    brand_branch: {
      id: BrandBranch["id"];
      branch_name: BrandBranch["branch_name"];
      coords: BrandBranch["coords"];
    }[];
  }[];
};

type BrandItem = {
  id: Brand["id"];
  brand_name: Brand["brand_name"];
  brand_logo_ipfs_url: Brand["brand_logo_ipfs_url"];
  brand_branch: {
    id: BrandBranch["id"];
    branch_name: BrandBranch["branch_name"];
    coords: BrandBranch["coords"];
  }[];
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

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setCustomerLocation({
        lat: position.coords.latitude,
        long: position.coords.longitude,
      });
    });
  }, []);

  useEffect(() => {
    if (!customerLocation || !brands) return;
    const sorted = [...brands.brands].sort((a, b): any => {
      const coordsA =
        typeof a.brand_branch[0].coords === "string"
          ? JSON.parse(a.brand_branch[0].coords)
          : a.brand_branch[0].coords;
      const coordsB =
        typeof b.brand_branch[0].coords === "string"
          ? JSON.parse(b.brand_branch[0].coords)
          : b.brand_branch[0].coords;
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
        className="mb-12 w-4/5"
        value={searchedAdmin}
        onChange={(e) => setSearchedAdmin(e.target.value)}
        placeholder="Kafeni ara..."
      />
      <div className="grid grid-cols-2 gap-16">
        {customerLocation
          ? sortedAdmins
              .filter((item) =>
                item.brand_name
                  ? item.brand_name
                      .toLowerCase()
                      .includes(searchedAdmin.toLowerCase())
                  : true
              )
              .map((item: BrandItem) => (
                <div
                  key={item.brand_branch[0].id}
                  className="flex flex-col items-center gap-4">
                  <Link
                    href={`/user/${convertString(
                      item.brand_name
                    )}/${convertString(
                      item.brand_branch[0].branch_name
                    )}?brandID=${item.id}&branchID=${item.brand_branch[0].id}`}>
                    <Image
                      src={
                        item.brand_logo_ipfs_url
                          ? item.brand_logo_ipfs_url.replace(
                              "ipfs://",
                              "https://ipfs.io/ipfs/"
                            )
                          : ""
                      }
                      alt="brand logo"
                      className="rounded-2xl cursor-pointer object-cover border-2 border-lad-pink"
                      key={item.brand_branch[0].id}
                      quality={100}
                      priority
                      width={100}
                      height={100}
                    />
                  </Link>
                  <p>{item.brand_name}</p>
                </div>
              ))
          : brands.brands
              .filter((item) =>
                item.brand_name
                  ? item.brand_name
                      .toLowerCase()
                      .includes(searchedAdmin.toLowerCase())
                  : true
              )
              .map((item: BrandItem, index: number) => (
                <div key={index} className="flex flex-col items-center gap-4">
                  <Link
                    href={`/user/${convertString(
                      item.brand_name
                    )}/${convertString(
                      item.brand_branch[0].branch_name
                    )}?brandID=${item.id}&branchID=${item.brand_branch[0].id}`}>
                    <Image
                      src={
                        item.brand_logo_ipfs_url
                          ? item.brand_logo_ipfs_url.replace(
                              "ipfs://",
                              "https://ipfs.io/ipfs/"
                            )
                          : ""
                      }
                      alt="brand logo"
                      className="rounded-2xl cursor-pointer object-cover border-2 border-lad-pink"
                      key={index}
                      quality={100}
                      priority
                      width={100}
                      height={100}
                    />
                  </Link>
                  <p>{item.brand_name}</p>
                </div>
              ))}
      </div>
    </div>
  );
}
