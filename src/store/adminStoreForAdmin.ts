import { create } from "zustand";

type Admin = {
  adminId: string;
  brandName: string;
  brandBranch: string;
  numberOfOrdersSoFar: number;
  notUsedNFTs: number;
  numberForReward: number;
  contractAddress: string;
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
    notUsedNFTs: 0,
    numberForReward: 0,
    contractAddress: "",
  },
  updateAdmin: (admin) => set(() => ({ admin: admin })),
}));

export default useAdminForAdminStore;
