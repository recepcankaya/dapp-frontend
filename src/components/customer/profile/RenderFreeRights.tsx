"use client";
import { createClient } from "@/src/lib/supabase/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

type RenderFreeRightsProps = {
  selectedTab: string;
  numberOfFreeRights: UserMission["number_of_free_rights"];
  freeRightImageUrl: Admin["free_right_image_url"];
  userID: User["id"];
  setQrCodeModalVisible: (value: boolean) => void;
};

export default function RenderFreeRights({
  selectedTab,
  numberOfFreeRights,
  freeRightImageUrl,
  userID,
  setQrCodeModalVisible,
}: RenderFreeRightsProps) {
  const freeRightsRef = useRef<number>(
    numberOfFreeRights
  ) as React.MutableRefObject<number>;
  const supabase = createClient();
  const router = useRouter();
  const numberOfFreeRightsArray = new Array(numberOfFreeRights).fill(0);

  useEffect(() => {
    const orders = supabase
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
          freeRightsRef.current = payload.new.number_of_free_rights;
          router.refresh();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(orders);
    };
  }, [userID, supabase, router]);

  return (
    <>
      {selectedTab === "Waiting" && (
        <div className="flex flex-wrap justify-center mt-16">
          {numberOfFreeRightsArray.length > 0 ? (
            numberOfFreeRightsArray.map((item, index) => (
              <div
                key={index.toString()}
                onClick={() => setQrCodeModalVisible(true)}
                className="mb-4">
                <Image
                  src={
                    freeRightImageUrl
                      ? freeRightImageUrl.replace(
                          "ipfs://",
                          "https://ipfs.io/ipfs/"
                        )
                      : ""
                  }
                  alt="nft"
                  priority
                  quality={100}
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
    </>
  );
}
