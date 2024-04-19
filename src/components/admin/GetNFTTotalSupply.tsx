"use client";
import { useContract, useTotalCount } from "@thirdweb-dev/react";

export default function GetNFTTotalSupply({
  contractAddress,
}: {
  contractAddress: string;
}) {
  const { contract } = useContract(contractAddress);
  const { data: usedNFts, isLoading, error } = useTotalCount(contract);
  return (
    <div className="flex items-center justify-around">
      <div className="w-24 h-24 rounded-full border-2 border-lad-pink flex items-center justify-center">
        <p className="text-lg">{isLoading ? <p>...</p> : Number(usedNFts)}</p>
      </div>
      <div className="w-3/5 h-16 bg-pink-500 rounded-lg pl-5 flex items-center">
        <p className="text-lg font-bold text-black">Verilen Ödüllerin Sayısı</p>
      </div>
    </div>
  );
}
