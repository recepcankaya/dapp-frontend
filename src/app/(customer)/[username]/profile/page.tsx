"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { useAddress, useContract, useOwnedNFTs } from "@thirdweb-dev/react";

import { createClient } from "@/src/lib/supabase/client";
import useUserStore from "@/src/store/userStore";
import useAdminStore from "@/src/store/adminStore";
import QrCodeModal from "@/src/components/QrCodeModal";

export default function Profile() {
  const [selectedTab, setSelectedTab] = useState("Waiting");
  const [qrCodeModalVisible, setQrCodeModalVisible] = useState<boolean>(false);
  const [numberOfFreeRights, setNumberOfFreeRights] = useState<number[]>([]);
  const userID = useUserStore((state) => state.user.id);
  const contractAddress = useAdminStore((state) => state.admin.contractAddress);
  const NFTSrc = useAdminStore((state) => state.admin.NFTSrc);
  const freeRightImageUrl = useAdminStore(
    (state) => state.admin.freeRightImageUrl
  );
  const supabase = createClient();
  const params = useParams<{ username: string }>();
  const searchParams = useSearchParams();
  const adminId = searchParams.get("admin");

  const address = useAddress();
  const { contract: usedNFTContract } = useContract(contractAddress);
  const {
    data: nftData,
    isLoading,
    error,
  } = useOwnedNFTs(usedNFTContract, address);
  const nftDataArray = nftData
    ? new Array(Number(nftData[0]?.quantityOwned)).fill(0)
    : [];

  const renderImages = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from("user_missions")
      .select("number_of_free_rights")
      .eq("user_id", user?.id)
      .eq("admin_id", adminId);
    if (data && data[0].number_of_free_rights !== null) {
      setNumberOfFreeRights(new Array(data[0].number_of_free_rights).fill(0));
    } else {
      console.log("error", error);
    }
  };

  useEffect(() => {
    renderImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  }, [numberOfFreeRights, userID, supabase]);

  return (
    <div className="flex flex-col items-center pt-20 text-white">
      <h1 className="text-xl mb-16 text-white">{params.username}</h1>
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
                  src={freeRightImageUrl.replace(
                    "ipfs://",
                    "https://ipfs.io/ipfs/"
                  )}
                  alt="nft"
                  width={375}
                  height={375}
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                  }}
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
            nftDataArray?.map((item, index) => (
              <div key={index} className="mb-4">
                <Image
                  src={NFTSrc.replace("ipfs://", "https://ipfs.io/ipfs/")}
                  width={375}
                  height={375}
                  alt="nfts"
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                  }}
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
        value={JSON.stringify({ forNFT: true })}
        onClose={() => setQrCodeModalVisible(false)}
      />
    </div>
  );
}
