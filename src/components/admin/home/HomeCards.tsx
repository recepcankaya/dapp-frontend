"use client";

import type { BrandBranchStatistics } from "@/src/lib/types/jsonQuery.types";

export default function HomeCards({
  brandBranchData,
}: {
  brandBranchData: BrandBranchStatistics;
}) {
  const statistics = [
    {
      id: 1,
      number: brandBranchData.monthly_total_orders,
      text: "Bu ay verilen sipariş sayısı",
    },
    {
      id: 2,
      number: brandBranchData.daily_total_orders,
      text: "Bugün verilen sipariş sayısı",
    },
    {
      id: 3,
      number: brandBranchData.daily_total_used_free_rights,
      text: "Bugün kullanılan ödül sayısı",
    },
    {
      id: 4,
      number: brandBranchData.total_used_free_rights,
      text: "Bugüne kadar kullanılmış ödüller",
    },
    {
      id: 5,
      number: brandBranchData.total_unused_free_rights,
      text: "Bekleyen ödüllerin sayısı",
    },
    {
      id: 6,
      number: brandBranchData.required_number_for_free_right,
      text: "Ödül için sipariş sayısı",
    },
  ];

  return (
    <section className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {statistics.map((item) => (
        <div
          key={item.id}
          className="flex flex-col gap-4 rounded-xl bg-[#ad775f] px-6 py-3 shadow-xl">
          <div className="text-4xl font-bold text-center">{item.number}</div>
          <h3 className="text-lg font-semibold text-center">{item.text}</h3>
        </div>
      ))}
    </section>
  );
}
