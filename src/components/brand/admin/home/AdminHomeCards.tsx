// @use client;
import React from "react";
import type { AdminHomeStatistics } from "@/src/lib/types/jsonQuery.types";

type AdminHomeCardsProps = {
  requiredNumberForFreeRight: number;
  adminData: AdminHomeStatistics;
  selectedBranch: string | null;
};

export default function AdminHomeCards({
  requiredNumberForFreeRight,
  adminData,
  selectedBranch,
}: AdminHomeCardsProps) {
  const statistics = [
    {
      id: 0,
      number: adminData.daily_total_orders,
      text: selectedBranch
        ? "Seçili şube için toplam sipariş sayısı"
        : "Toplam sipariş sayısı",
    },
    {
      id: 1,
      number: adminData.daily_total_used_free_rights,
      text: selectedBranch
        ? "Seçili şube için bugüne kadar kullanılan ödüller"
        : "Bugüne kadar kullanılmış ödüller",
    },
    {
      id: 2,
      number: adminData.monthly_total_orders,
      text: selectedBranch
        ? "Seçili şube için bu ay verilen sipariş sayısı"
        : "Bu ay verilen sipariş sayısı",
    },
    {
      id: 3,
      number: adminData.total_orders,
      text: selectedBranch
        ? "Seçili şube için toplam sipariş sayısı"
        : "Toplam sipariş sayısı",
    },
    {
      id: 4,
      number: adminData.total_used_free_rights,
      text: selectedBranch
        ? "Seçili şube için bugüne kadar kullanılmış ödüller"
        : "Bugüne kadar kullanılmış ödüller",
    },
    {
      id: 5,
      number: adminData.total_unused_free_rights,
      text: selectedBranch
        ? "Seçili şube için bekleyen ödüllerin sayısı"
        : "Bekleyen ödüllerin sayısı",
    },
    {
      id: 6,
      number: requiredNumberForFreeRight,
      text: selectedBranch
        ? "Seçili şube ödül için sipariş sayısı"
        : "Ödül için sipariş sayısı",
    },
  ];

  return (
    <section className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {statistics.map((item) => (
        <div
          key={item.id}
          className="flex flex-col gap-4 rounded-xl bg-[#ad775f] px-6 py-3 shadow-xl"
        >
          <div className="text-4xl font-bold text-center">{item.number}</div>
          <h3 className="text-lg font-semibold text-center">{item.text}</h3>
        </div>
      ))}
    </section>
  );
}
