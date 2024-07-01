import { Json } from "./database.types";

export type BrandBranchInfo =
  Database["public"]["Tables"]["brand_branch"]["Row"];

type BrandInfo = Database["public"]["Tables"]["brand"]["Row"];

export interface MonthlyOrdersJustMonth {
  [key: string]: number;
}

export interface MonthlyOrdersWithYear {
  [key: string]: MonthlyOrdersJustMonth;
}

export type BrandBranchStatistics = Pick<
  BrandBranchInfo & BrandInfo,
  | "total_orders"
  | "total_used_free_rights"
  | "daily_total_orders"
  | "daily_total_used_free_rights"
  | "monthly_total_orders"
  | "weekly_total_orders"
  | "required_number_for_free_right"
  | "total_unused_free_rights"
>;

export type AdminHomeStatistics = Pick<
  BrandInfo & BrandBranchInfo,
  | "total_orders"
  | "total_used_free_rights"
  | "total_unused_free_rights"
  | "daily_total_orders"
  | "daily_total_used_free_rights"
  | "monthly_total_orders"
>;

type AdminBrandInfo = Pick<BrandInfo, "id" | "brand_name" | "brand_logo_url" | "required_number_for_free_right">;
type AdminBranchInfo = Pick<BrandBranchInfo, "id" | "branch_name" | "total_orders" | "total_used_free_rights" | "total_unused_free_rights" | "daily_total_orders" | "daily_total_used_free_rights" | "monthly_total_orders" | "weekly_total_orders">; 

export type AdminBrandBranchInfo = AdminBrandInfo & {
  brand_branch: AdminBranchInfo[];
};

