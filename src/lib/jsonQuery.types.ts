export type Admin = Database["public"]["Tables"]["admins"]["Row"];

export interface AdminCampaigns extends Omit<Admin, "campaigns"> {
  campaigns: Campaign[] | null;
}

export type Campaign = {
  campaign_id: string;
  campaign_image: string;
  campaign_name?: string;
};
