import { create } from "zustand";

export type Admin = {
  id: string;
  brandName: string;
  brandLogo: string;
  numberForReward: number;
  NFTSrc: string;
  contractAddress: string;
  notUsedNFTSrc: string;
  notUsedContractAddress: string;
};

type State = {
  admin: Admin;
};

type Action = {
  updateAdmin: (admin: State["admin"]) => void;
};

const useAdminStore = create<State & Action>((set) => ({
  admin: {
    id: "",
    brandName: "",
    brandLogo: "",
    numberForReward: 0,
    NFTSrc: "",
    contractAddress: "",
    notUsedNFTSrc: "",
    notUsedContractAddress: "",
  },
  updateAdmin: (admin) => set(() => ({ admin })),
}));

export default useAdminStore;
