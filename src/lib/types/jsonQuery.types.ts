export type Admin = Database["public"]["Tables"]["admins"]["Row"];

export interface AdminCampaigns extends Omit<Admin, "campaigns"> {
  campaigns: Campaign[] | null;
}

export type Campaign = {
  campaign_id: string;
  campaign_image: string;
  campaign_name?: string;
};

export type AdminStatistics = Pick<
  Admin,
  | "brand_name"
  | "brand_branch"
  | "not_used_nfts"
  | "number_for_reward"
  | "number_of_orders_so_far"
  | "admin_used_rewards"
  | "contract_address"
>;
