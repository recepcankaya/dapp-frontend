"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import useAdminStore, { Admin } from "@/src/store/adminStore";
import useUserStore from "@/src/store/userStore";
import { haversine } from "@/src/lib/haveresine";
import { Json } from "@/src/lib/database.types";
import { Input } from "../ui/input";

type RenderBrandsProps = {
  brands: {
    id: string;
    brand_name: string | null;
    brand_logo_ipfs_url: string | null;
    ticket_ipfs_url: string | null;
    number_for_reward: number | null;
    nft_src: string | null;
    contract_address: string | null;
    coords: Json | null;
  }[];
};

export default function RenderBrands(brands: RenderBrandsProps) {
  const [customerLocation, setCustomerLocation] = useState<{
    lat: number;
    long: number;
  } | null>(null);
  const [sortedAdmins, setSortedAdmins] = useState<
    {
      id: string;
      brand_name: string | null;
      brand_logo_ipfs_url: string | null;
      ticket_ipfs_url: string | null;
      number_for_reward: number | null;
      nft_src: string | null;
      contract_address: string | null;
      coords: Json;
    }[]
  >([]);
  const [searchedAdmin, setSearchedAdmin] = useState<string>("");
  const updateAdmin = useAdminStore((state) => state.updateAdmin);
  const username = useUserStore((state) => state.user.username);
  const router = useRouter();

  const selectBrand = (item: any) => {
    const admin: Admin = {
      id: item.id,
      brandName: item.brand_name,
      brandLogo: item.brand_logo_ipfs_url,
      ticketImage: item.ticket_ipfs_url,
      numberForReward: item.number_for_reward,
      NFTSrc: item.nft_src,
      contractAddress: item.contract_address,
      coords: {
        lat: item.coords?.lat,
        long: item.coords?.long,
      },
    };
    updateAdmin(admin);
    localStorage.setItem("adminID", item.id);
    router.push(`/${username}`);
  };

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
    <div>
      <Input
        className="mb-12"
        value={searchedAdmin}
        onChange={(e) => setSearchedAdmin(e.target.value)}
        placeholder="Kafeni ara..."
      />
      <div className="grid grid-cols-2 gap-10">
        {customerLocation
          ? sortedAdmins
              .filter((item) =>
                item.brand_name
                  ? item.brand_name
                      .toLowerCase()
                      .includes(searchedAdmin.toLowerCase())
                  : true
              )
              .map((item: any, index: number) => (
                <div key={index} className="flex flex-col items-center gap-6">
                  <div className="relative w-36 h-36">
                    <Image
                      src={item.brand_logo_ipfs_url.replace(
                        "ipfs://",
                        "https://ipfs.io/ipfs/"
                      )}
                      alt="brand logo"
                      className="rounded-2xl cursor-pointer object-cover border-2 border-lad-pink"
                      onClick={() => selectBrand(item)}
                      key={index}
                      priority
                      fill
                      sizes="10vw"
                    />
                  </div>
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
              .map((item: any, index: number) => (
                <div key={index} className="flex flex-col items-center gap-6">
                  <div className="relative w-36 h-36">
                    <Image
                      src={item.brand_logo_ipfs_url.replace(
                        "ipfs://",
                        "https://ipfs.io/ipfs/"
                      )}
                      alt="brand logo"
                      className="rounded-2xl cursor-pointer object-cover border-2 border-lad-pink"
                      onClick={() => selectBrand(item)}
                      key={index}
                      priority
                      fill
                      sizes="10vw"
                    />
                  </div>
                  <p>{item.brand_name}</p>
                </div>
              ))}
      </div>
    </div>
  );
}
