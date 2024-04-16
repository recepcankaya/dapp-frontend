"use client"
import Image from "next/image";
import useAdminStore from "@/src/store/adminStore";
import { useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import useUserStore from "@/src/store/userStore";


export default function RenderFreeRights({numberOfFreeRights}: {numberOfFreeRights: number[]}) {
 
  const notUsedNFTSrc = useAdminStore((state) => state.admin.notUsedNFTSrc);
  const supabase = createClientComponentClient();
  const userID = useUserStore((state) => state.user.id);

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
          // setNumberOfFreeRights(
          //   new Array(payload.new.number_of_free_rights).fill(0)
          // );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(numberOfFreeRights);
    };
  }, [numberOfFreeRights, userID]);

  return (
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
}