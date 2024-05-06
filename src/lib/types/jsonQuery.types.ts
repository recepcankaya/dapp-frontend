export type BrandBranchInfo =
  Database["public"]["Tables"]["brand_branch"]["Row"];

type BrandInfo = Database["public"]["Tables"]["brand"]["Row"];

export interface AdminCampaigns extends Omit<BrandBranchInfo, "campaigns"> {
  campaigns: Campaign[] | null;
}

export type Campaign = {
  campaign_id: string;
  campaign_image: string;
  campaign_name?: string;
};

export type BrandBranchStatistics = Pick<
  BrandBranchInfo & BrandInfo,
  | "total_orders"
  | "total_used_free_rights"
  | "daily_total_orders"
  | "daily_total_used_free_rights"
  | "monthly_total_orders"
  | "required_number_for_free_right"
  | "total_unused_free_rights"
>;
