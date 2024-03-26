"use client";
import supabase from "@/src/utils/supabase";

import { toast } from "@/src/components/ui/use-toast";
import useAdminForAdminStore from "@/src/store/adminStoreForAdmin";
import { Toaster } from "@/src/components/ui/toaster";
import { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function UserInfo() {
  const updateAdmin = useAdminForAdminStore((state) => state.updateAdmin);
  const adminID = useAdminForAdminStore((state) => state.admin.adminId);
  const brandName = useAdminForAdminStore((state) => state.admin.brandName);
  const brandBranch = useAdminForAdminStore((state) => state.admin.brandBranch);
  const numberOfOrdersSoFar = useAdminForAdminStore(
    (state) => state.admin.numberOfOrdersSoFar
  );
  const usedNFTs = useAdminForAdminStore((state) => state.admin.usedNFTs);
  const notUsedNFTs = useAdminForAdminStore((state) => state.admin.notUsedNFTs);
  const numberForReward = useAdminForAdminStore(
    (state) => state.admin.numberForReward
  );
  const router = useRouter();

  const fetchAdminDashboard = async () => {
    try {
      const { data: adminData, error: adminError } = await supabase
        .from("admins")
        .select(
          "brand_name, brand_branch, used_nfts, not_used_nfts, number_for_reward, number_of_orders_so_far, contract_address, nft_src, not_used_nft_src, not_used_contract_address"
        )
        .eq("id", adminID);
      if (adminData) {
        updateAdmin({
          adminId: adminID,
          brandName: adminData[0].brand_name,
          brandBranch: adminData[0].brand_branch,
          numberOfOrdersSoFar: adminData[0].number_of_orders_so_far,
          usedNFTs: adminData[0].used_nfts,
          notUsedNFTs: adminData[0].not_used_nfts,
          numberForReward: adminData[0].number_for_reward,
          contractAddress: adminData[0].contract_address,
          NFTSrc: adminData[0].nft_src,
          notUsedContractAddress: adminData[0].not_used_contract_address,
          notUsedNFTSrc: adminData[0].not_used_nft_src,
        });
      } else {
        console.error(adminError);
      }
    } catch (error) {
      toast({ title: "Bir hata oluştu" });
    }
  };

  useEffect(() => {
    fetchAdminDashboard();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
      <Toaster />
      <div className="w-11/12 h-[650px] flex flex-col justify-between">
        <div className="flex items-center justify-around">
          <div className="w-24 h-24 rounded-full border-2 border-lad-pink flex items-center justify-center">
            <p className="text-lg"></p>
          </div>
          <div className="w-3/5 h-16 bg-pink-500 rounded-lg pl-5 flex items-center">
            <p className="text-lg font-bold text-black">{brandName}</p>
          </div>
        </div>
        <div className="flex items-center justify-around">
          <div className="w-24 h-24 rounded-full border-2 border-lad-pink flex items-center justify-center">
            <p className="text-lg"></p>
          </div>
          <div className="w-3/5 h-16 bg-pink-500 rounded-lg pl-5 flex items-center">
            <p className="text-lg font-bold text-black">{brandBranch}</p>
          </div>
        </div>
        <div className="flex items-center justify-around">
          <div className="w-24 h-24 rounded-full border-2 border-lad-pink flex items-center justify-center">
            <p className="text-lg">{numberOfOrdersSoFar}</p>
          </div>
          <div className="w-3/5 h-16 bg-pink-500 rounded-lg pl-5 flex items-center">
            <p className="text-lg font-bold text-black">
              Bugüne Kadar Kaç Ürün Satıldığı
            </p>
          </div>
        </div>
        <div className="flex items-center justify-around">
          <div className="w-24 h-24 rounded-full border-2 border-lad-pink flex items-center justify-center">
            <p className="text-lg">{notUsedNFTs}</p>
          </div>
          <div className="w-3/5 h-16 bg-pink-500 rounded-lg pl-5 flex items-center">
            <p className="text-lg font-bold text-black">
              Bekleyen Ödüllerin Sayısı
            </p>
          </div>
        </div>
        <div className="flex items-center justify-around">
          <div className="w-24 h-24 rounded-full border-2 border-lad-pink flex items-center justify-center">
            <p className="text-lg">{usedNFTs}</p>
          </div>
          <div className="w-3/5 h-16 bg-pink-500 rounded-lg pl-5 flex items-center">
            <p className="text-lg font-bold text-black">
              Verilen Ödüllerin Sayısı
            </p>
          </div>
        </div>
        <div className="flex items-center justify-around">
          <div className="w-24 h-24 rounded-full border-2 border-lad-pink flex items-center justify-center">
            <p className="text-lg">{numberForReward}</p>
          </div>
          <div className="w-3/5 h-16 bg-pink-500 rounded-lg pl-5 flex items-center">
            <p className="text-lg font-bold text-black">
              Kaç Alışverişte Ödül Verileceği
            </p>
          </div>
        </div>
      </div>
      <button
        onClick={() => router.push("/admin-camera")}
        className="absolute bottom-4 w-12 h-12">
        <Image
          src="/src/public/qr-code.png"
          alt="QR Code"
          width={48}
          height={48}
        />
      </button>
    </div>
  );
}
