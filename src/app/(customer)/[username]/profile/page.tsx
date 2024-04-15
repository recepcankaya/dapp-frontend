"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

import useUserStore from "@/src/store/userStore";
import useAdminStore from "@/src/store/adminStore";
import QrCodeModal from "@/src/components/QrCodeModal";
import { useAddress, useContract, useOwnedNFTs } from "@thirdweb-dev/react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function Profile() {
  const [selectedTab, setSelectedTab] = useState("Waiting");
  const [qrCodeModalVisible, setQrCodeModalVisible] = useState<boolean>(false);
  const [numberOfFreeRights, setNumberOfFreeRights] = useState<number[]>([]);
  const username = useUserStore((state) => state.user.username);
  const userID = useUserStore((state) => state.user.id);
  const adminId = useAdminStore((state) => state.admin.id);
  const contractAddress = useAdminStore((state) => state.admin.contractAddress);
  const NFTSrc = useAdminStore((state) => state.admin.NFTSrc);
  const supabase = createClientComponentClient();

  const notUsedNFTSrc = useAdminStore((state) => state.admin.notUsedNFTSrc);
  const address = useAddress();
  const { contract: usedNFTContract } = useContract(contractAddress);
  const {
    data: nftData,
    isLoading,
    error,
  } = useOwnedNFTs(usedNFTContract, address);

  const renderImages = async () => {
    const { data, error } = await supabase
      .from("user_missions")
      .select("number_of_free_rights")
      .eq("user_id", userID)
      .eq("admin_id", adminId);
    if (data && data[0].number_of_free_rights !== null) {
      console.log("data", data);
      setNumberOfFreeRights(new Array(data[0].number_of_free_rights).fill(0));
    } else {
      console.log("error", error);
    }
  };

  useEffect(() => {
    renderImages();
  }, []);

  useEffect(() => {
    const numberOfFreeRights = supabase
      .channel("orders-change-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "user_missions",
          filter: `user_id=eq.${userID}`,
        },
        (payload: any) => {
          setNumberOfFreeRights(
            new Array(payload.new.number_of_free_rights).fill(0)
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(numberOfFreeRights);
    };
  }, [numberOfFreeRights, userID]);

  return (
    <div className="flex flex-col items-center pt-20 text-white">
      <h1 className="text-xl mb-16 text-white">{username}</h1>
      <div className="flex justify-around w-full">
        <button
          onClick={() => setSelectedTab("Waiting")}
          className={`py-2 ${
            selectedTab === "Waiting" ? "border-b-2 border-white" : ""
          }`}>
          Bekleyenler
        </button>
        <button
          onClick={() => setSelectedTab("Your Collection")}
          className={`py-2 ${
            selectedTab === "Your Collection" ? "border-b-2 border-white" : ""
          }`}>
          Koleksiyonunuz
        </button>
      </div>
      {selectedTab === "Waiting" && (
        <div className="flex flex-wrap justify-center mt-16">
          {numberOfFreeRights.length > 0 ? (
            numberOfFreeRights.map((item, index) => (
              <div
                key={index.toString()}
                onClick={() => setQrCodeModalVisible(true)}
                className="mb-4">
                <Image
                  src={notUsedNFTSrc.replace(
                    "ipfs://",
                    "https://ipfs.io/ipfs/"
                  )}
                  alt="nft"
                  width={375}
                  height={375}
                />
              </div>
            ))
          ) : (
            <p>Şu anda indirim/ücretsiz hakkınız bulunmamaktadır.</p>
          )}
        </div>
      )}
      {selectedTab === "Your Collection" && (
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
      )}
      <QrCodeModal
        isVisible={qrCodeModalVisible}
        value={JSON.stringify({ userId: userID, forNFT: true, address })}
        onClose={() => setQrCodeModalVisible(false)}
      />
    </div>
  );
}
