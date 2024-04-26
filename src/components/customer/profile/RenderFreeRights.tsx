"use client";
import Image from "next/image";

type RenderFreeRightsProps = {
  selectedTab: string;
  numberOfFreeRights: any;
  freeRightImageUrl: any;
  setQrCodeModalVisible: (value: boolean) => void;
};

export default function RenderFreeRights({
  selectedTab,
  numberOfFreeRights,
  freeRightImageUrl,
  setQrCodeModalVisible,
}: RenderFreeRightsProps) {
  const numberOfFreeRightsArray = new Array(numberOfFreeRights).fill(0);

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
                  src={freeRightImageUrl.replace(
                    "ipfs://",
                    "https://ipfs.io/ipfs/"
                  )}
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
