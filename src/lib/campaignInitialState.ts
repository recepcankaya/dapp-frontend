export type CampaignStatus = {
  success: unknown;
  message: string;
  campaign: Campaigns;
};

export const initialState: CampaignStatus = {
  success: false,
  message: "",
  campaign: {
    id: "",
    branch_id: "",
    name: "",
    image_url: "",
    position: 0,
    is_favourite: false,
  },
};
