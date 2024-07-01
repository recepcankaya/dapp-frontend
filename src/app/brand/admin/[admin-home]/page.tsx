import { createClient } from "@/src/lib/supabase/server";

import getUserID from "@/src/lib/getUserID";
import AdminHomeHeader from "@/src/components/brand/admin/home/AdminHomeHeader";
import RenderAdminStatistics from "@/src/components/brand/admin/home/AdminStatistics";

export default async function AdminHome() {
  const supabase = createClient();
  const userID = await getUserID();

  const { data } = await supabase
    .from("brand")
    .select(
      `id,
      brand_name, 
      brand_logo_url, 
      required_number_for_free_right, 
      brand_branch(
        id,
        branch_name,
        total_orders, 
        total_used_free_rights, 
        total_unused_free_rights, 
        daily_total_orders, 
        daily_total_used_free_rights, 
        monthly_total_orders,
        weekly_total_orders
      )`
    )
    .eq("id", userID);

  if (!data) {
    return <div>Veri bulunamadı. Lütfen tekrar deneyiniz.</div>;
  }

  /**
   * Calculates the required data from the given array of items.
   * @param data - The array of items to calculate data from.
   * @returns An array of calculated data objects.
   */
  const calculateData = data[0].brand_branch.map((item) => ({
    total_orders: item.total_orders,
    total_used_free_rights: item.total_used_free_rights,
    total_unused_free_rights: item.total_unused_free_rights,
    daily_total_orders: item.daily_total_orders,
    daily_total_used_free_rights: item.daily_total_used_free_rights,
    monthly_total_orders: item.monthly_total_orders,
  }));

  /**
   * Calculates the aggregated data from an array of data objects.
   *
   * @param calculateData - The array of data objects to calculate from.
   * @returns The calculated aggregated data object.
   */
  const calculatedData = calculateData.reduce(
    (acc, item) => {
      acc.total_orders += item.total_orders;
      acc.total_used_free_rights += item.total_used_free_rights;
      acc.total_unused_free_rights += item.total_unused_free_rights;
      acc.daily_total_orders += item.daily_total_orders;
      acc.daily_total_used_free_rights += item.daily_total_used_free_rights;
      acc.monthly_total_orders += item.monthly_total_orders;

      return acc;
    },
    {
      total_orders: 0,
      total_used_free_rights: 0,
      total_unused_free_rights: 0,
      daily_total_orders: 0,
      daily_total_used_free_rights: 0,
      monthly_total_orders: 0,
    }
  );

  // @todo - will be refactored
  const weeklyTotalOrders = data[0].brand_branch.reduce<{
    [key: string]: number;
  }>((acc, item) => {
    if (
      item.weekly_total_orders &&
      typeof item.weekly_total_orders === "object" &&
      !Array.isArray(item.weekly_total_orders)
    ) {
      Object.keys(item.weekly_total_orders).forEach((day) => {
        const value = (item.weekly_total_orders as { [key: string]: number })[
          day
        ];
        if (typeof value === "number") {
          if (!acc[day]) {
            acc[day] = 0;
          }
          acc[day] += value;
        }
      });
    }
    return acc;
  }, {});

  return (
    <div>
      <AdminHomeHeader
        brandName={data[0].brand_name}
        brandLogo={data[0].brand_logo_url}
      />
      <RenderAdminStatistics
        brandData={data[0]}
        requiredNumberForFreeRight={data[0].required_number_for_free_right}
        weeklyTotalOrders={weeklyTotalOrders}
        calculatedData={calculatedData}
      />
    </div>
  );
}
