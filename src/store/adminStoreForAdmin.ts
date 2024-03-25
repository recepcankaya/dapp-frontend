import { create } from "zustand";

type Admin = {
  adminId: string;
  brandName: string;
  brandBranch: string;
  numberOfOrdersSoFar: number;
  usedNFTs: number;
  notUsedNFTs: number;
  numberForReward: number;
  contractAddress: string;
  NFTSrc: string;
  notUsedNFTSrc: string;
  notUsedContractAddress: string;
};

type State = {
  admin: Admin;
};

type Action = {
  updateAdmin: (admin: State["admin"]) => void;
};

const useAdminForAdminStore = create<State & Action>((set) => ({
  admin: {
    adminId: "",
    brandName: "",
    brandBranch: "",
    numberOfOrdersSoFar: 0,
    usedNFTs: 0,
    notUsedNFTs: 0,
    numberForReward: 0,
    contractAddress: "",
    NFTSrc: "",
    notUsedNFTSrc: "",
    notUsedContractAddress: "",
  },
  updateAdmin: (admin) => set(() => ({ admin: admin })),
}));

export default useAdminForAdminStore;
