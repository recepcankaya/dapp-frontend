"use client";

import type { AdminStatistics } from "@/src/lib/types/jsonQuery.types";

export default function HomeCards({
  adminData,
}: {
  adminData: AdminStatistics[];
}) {
  return (
    <section className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      <div className="flex flex-col gap-4 rounded-xl bg-[#ad775f] px-6 py-3 shadow-xl">
        <div className="text-4xl font-bold text-center">
          {adminData[0].admin_used_rewards}
        </div>
        <h3 className="text-lg font-semibold text-center">
          Bugüne kadar kullanılmış ödüller
        </h3>
      </div>
      <div className="flex flex-col gap-4 rounded-xl bg-[#ad775f] px-6 py-3 shadow-xl">
        <div className="text-4xl font-bold text-center">
          {adminData[0].not_used_nfts}
        </div>
        <h3 className="text-lg font-semibold text-center">
          Bekleyen ödüllerin sayısı
        </h3>
      </div>
      <div className="flex flex-col gap-4 rounded-xl bg-[#ad775f] px-6 py-3 shadow-xl">
        <div className="text-4xl font-bold text-center">
          {adminData[0].number_for_reward}
        </div>
        <h3 className="text-lg font-semibold text-center">
          Ödül için sipariş sayısı
        </h3>
      </div>
    </section>
  );
}
