"use client";
export default function RenderCustomerNFTs({
  selectedTab,
}: {
  selectedTab: string;
}) {
  return (
    <>
      {selectedTab === "Your Collection" && (
        <h1 className="mt-20 text-2xl">Yakında...</h1>
      )}
    </>
  );
}

// <div className="flex flex-wrap justify-center mt-16">
//   {nftData && nftData.length > 0 ? (
//     nftDataArray?.map((item, index) => (
//       <div key={index} className="mb-4">
//         <Image
//           src={NFTSrc.replace("ipfs://", "https://ipfs.io/ipfs/")}
//           width={375}
//           height={375}
//           alt="nfts"
//           style={{
//             maxWidth: "100%",
//             height: "auto",
//           }}
//         />
//       </div>
//     ))
//   ) : (
//     <p>Herhangi bir Koleksiyon parçasına sahip değilsiniz.</p>
//   )}
// </div>
