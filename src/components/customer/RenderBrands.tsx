"use client";

import useAdminStore, { Admin } from "@/src/store/adminStore";
import useUserStore from "@/src/store/userStore";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function RenderBrands({ brands }: { brands: any }) {
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
    };
    updateAdmin(admin);
    router.push(`/${username}`);
  };

  return (
    <div className="grid grid-cols-2 gap-6">
      {brands.map((item: any, index: number) => (
        <>
          <Image
            loading="lazy"
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
          />
        </>
      ))}
    </div>
  );
}
