"use client";

import { useEffect } from "react";
import Image from "next/image";

import useAdminStore, { Admin } from "@/src/store/adminStore";
import { secretSupabase } from "@/src/utils/supabase";
import { useRouter } from "next/navigation";
import useUserStore from "@/src/store/userStore";

const Brands = () => {
  const admins = useAdminStore((state) => state.admins);
  const updateAdmin = useAdminStore((state) => state.updateAdmin);
  const updateAdmins = useAdminStore((state) => state.updateAdmins);
  const username = useUserStore((state) => state.user.username);
  const router = useRouter();

  const fetchAdmins = async () => {
    try {
      // @todo - auth yapmak için users ile adminsi bağlayalım
      const { data, error } = await secretSupabase
        .from("admins")
        .select(
          "id, brand_name, brand_logo_ipfs_url, number_for_reward, nft_src, contract_address, not_used_nft_src, not_used_contract_address"
        );
      if (error) {
        console.log(error);
      } else {
        const admins: Admin[] = data.map((item) => ({
          id: item.id,
          brandName: item.brand_name,
          brandLogo: item.brand_logo_ipfs_url,
          numberForReward: item.number_for_reward,
          NFTSrc: item.nft_src,
          contractAddress: item.contract_address,
          notUsedNFTSrc: item.not_used_nft_src,
          notUsedContractAddress: item.not_used_contract_address,
        }));
        updateAdmins(admins);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const selectBrand = (item: Admin) => {
    updateAdmin(item);
    router.push(`/${username}`);
  };

  return (
    <section className="flex justify-center pt-24">
      <div className="grid grid-cols-2 gap-6">
        {admins.map((item, index) => (
          <Image
            loading="lazy"
            src={item.brandLogo.replace("ipfs://", "https://ipfs.io/ipfs/")}
            alt="brand logo"
            width={150}
            height={100}
            className="rounded-2xl cursor-pointer"
            onClick={() => selectBrand(item)}
            key={index}
          />
        ))}
      </div>
    </section>
  );
};

export default Brands;
