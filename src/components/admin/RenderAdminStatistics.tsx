"use client";
import Link from "next/link";

export default function RenderAdminStatistics({
  adminData,
}: {
  adminData: any;
}) {
  return (
    <>
      <Link
        href={`/admin/${adminData && adminData[0].brand_name}-${
          adminData && adminData[0].brand_branch
        }/admin-camera`}>
        Qr Kodu Okut
      </Link>
      <div className="w-11/12 h-[650px] flex flex-col justify-between">
        <div className="flex items-center justify-around">
          <div className="w-24 h-24 rounded-full border-2 border-lad-pink flex items-center justify-center">
            <p className="text-lg"></p>
          </div>
          <div className="w-3/5 h-16 bg-pink-500 rounded-lg pl-5 flex items-center">
            <p className="text-lg font-bold text-black">
              {adminData && adminData[0].brand_name}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-around">
          <div className="w-24 h-24 rounded-full border-2 border-lad-pink flex items-center justify-center">
            <p className="text-lg"></p>
          </div>
          <div className="w-3/5 h-16 bg-pink-500 rounded-lg pl-5 flex items-center">
            <p className="text-lg font-bold text-black">
              {adminData && adminData[0].brand_branch}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-around">
          <div className="w-24 h-24 rounded-full border-2 border-lad-pink flex items-center justify-center">
            <p className="text-lg">
              {adminData && adminData[0].number_of_orders_so_far}
            </p>
          </div>
          <div className="w-3/5 h-16 bg-pink-500 rounded-lg pl-5 flex items-center">
            <p className="text-lg font-bold text-black">
              Bugüne Kadar Kaç Ürün Satıldığı
            </p>
          </div>
        </div>
        <div className="flex items-center justify-around">
          <div className="w-24 h-24 rounded-full border-2 border-lad-pink flex items-center justify-center">
            <p className="text-lg">{adminData && adminData[0].not_used_nfts}</p>
          </div>
          <div className="w-3/5 h-16 bg-pink-500 rounded-lg pl-5 flex items-center">
            <p className="text-lg font-bold text-black">
              Bekleyen Ödüllerin Sayısı
            </p>
          </div>
        </div>
        {/* <GetNFTTotalSupply
          contractAddress={adminData && adminData[0].contract_address}
        /> */}
        <div className="flex items-center justify-around">
          <div className="w-24 h-24 rounded-full border-2 border-lad-pink flex items-center justify-center">
            <p className="text-lg">
              {adminData && adminData[0].number_for_reward}
            </p>
          </div>
          <div className="w-3/5 h-16 bg-pink-500 rounded-lg pl-5 flex items-center">
            <p className="text-lg font-bold text-black">
              Kaç Alışverişte Ödül Verileceği
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
