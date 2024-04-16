"use client";
import Image from "next/image";

import { useAddress, useContract, useOwnedNFTs } from "@thirdweb-dev/react";
import useAdminStore from "@/src/store/adminStore";

export default function RenderCustomerNFTs() {
  const contractAddress = useAdminStore((state) => state.admin.contractAddress);
  const NFTSrc = useAdminStore((state) => state.admin.NFTSrc);

  const address = useAddress();
  const { contract: usedNFTContract } = useContract(contractAddress);
  const {
    data: nftData,
    isLoading,
    error,
  } = useOwnedNFTs(usedNFTContract, address);
  return (
    <div className="flex flex-wrap justify-center mt-16">
      {nftData && nftData.length > 0 ? (
        nftData?.map((item) => (
          <div key={item.metadata.id} className="mb-4">
            <Image
              src={NFTSrc.replace("ipfs://", "https://ipfs.io/ipfs/")}
              width={375}
              height={375}
              alt="nfts"
            />
          </div>
        ))
      ) : (
        <p>Herhangi bir Koleksiyon parçasına sahip değilsiniz.</p>
      )}
    </div>
  );
}
