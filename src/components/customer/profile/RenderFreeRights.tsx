"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { createClient } from "@/src/lib/supabase/client";
import { useEffect, useRef } from "react";

type RenderFreeRightsProps = {
  selectedTab: string;
  userTotalFreeRights: UserOrders["user_total_free_rights"] | undefined;
  freeRightImageUrl: Brand["free_right_image_url"] | undefined;
  userID: User["id"];
  setQrCodeModalVisible: (value: boolean) => void;
};

export default function RenderFreeRights({
  selectedTab,
  userTotalFreeRights,
  freeRightImageUrl,
  userID,
  setQrCodeModalVisible,
}: RenderFreeRightsProps) {
  const freeRightsRef = useRef<number>(
    userTotalFreeRights ?? 0
  ) as React.MutableRefObject<number>;
  const supabase = createClient();
  const router = useRouter();
  const userTotalFreeRightsArray = new Array(userTotalFreeRights).fill(0);

  useEffect(() => {
    const orders = supabase
      .channel("orders-change-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "user_orders",
          filter: `user_id=eq.${userID}`,
        },
        (payload: any) => {
          freeRightsRef.current = payload.new.user_total_free_rights;
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
          {userTotalFreeRightsArray.length > 0 ? (
            userTotalFreeRightsArray.map((item, index) => (
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
