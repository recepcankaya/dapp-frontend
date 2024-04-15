"use client";

import { haversine } from "@/src/lib/haveresine";
import useAdminStore, { Admin } from "@/src/store/adminStore";
import useUserStore from "@/src/store/userStore";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";

export default function RenderBrands({ brands }: { brands: any }) {
  const [customerLocation, setCustomerLocation] = useState<{
    lat: number;
    long: number;
  } | null>(null);
  const [sortedAdmins, setSortedAdmins] = useState<Admin[]>([]);
  const [searchedAdmin, setSearchedAdmin] = useState<string>("");
  const updateAdmin = useAdminStore((state) => state.updateAdmin);
  const username = useUserStore((state) => state.user.username);
  const router = useRouter();

  const selectBrand = (item: any) => {
    const admin: Admin = {
      id: item.id,
      brandName: item.brand_name,
      brandLogo: item.brand_logo_ipfs_url,
      numberForReward: item.number_for_reward,
      NFTSrc: item.nft_src,
      contractAddress: item.contract_address,
      notUsedNFTSrc: item.not_used_nft_src,
      notUsedContractAddress: item.not_used_contract_address,
      coords: {
        lat: item.coords?.lat,
        long: item.coords?.long,
      },
    };
    updateAdmin(admin);
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
    const sorted: Admin[] = [...brands].sort((a, b): any => {
      const distanceA = haversine(
        { lat: customerLocation?.lat, lng: customerLocation?.long },
        { lat: a.coords?.lat, lng: a.coords?.long }
      );
      const distanceB = haversine(
        { lat: customerLocation.lat, lng: customerLocation.long },
        { lat: b.coords?.lat, lng: b.coords?.long }
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
      <div className="grid grid-cols-2 gap-6">
        {customerLocation
          ? sortedAdmins.map((item: any, index: number) => (
              <div key={index} className="flex flex-col items-center gap-6">
                <Image
                  src={item.brand_logo_ipfs_url.replace(
                    "ipfs://",
                    "https://ipfs.io/ipfs/"
                  )}
                  alt="brand logo"
                  width={150}
                  height={100}
                  className="rounded-2xl cursor-pointer"
                  onClick={() => selectBrand(item)}
                  key={index}
                  priority
                />
                <p>Sorted {item.brand_name}</p>
              </div>
            ))
          : brands.map((item: any, index: number) => (
              <div key={index} className="flex flex-col items-center gap-6">
                <Image
                  src={item.brand_logo_ipfs_url.replace(
                    "ipfs://",
                    "https://ipfs.io/ipfs/"
                  )}
                  alt="brand logo"
                  width={150}
                  height={100}
                  className="rounded-2xl cursor-pointer"
                  onClick={() => selectBrand(item)}
                  key={index}
                  priority
                />
                <p>{item.brand_name}</p>
              </div>
            ))}
      </div>
    </div>
  );
}
