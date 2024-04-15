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
  coords: {
    lat: number;
    long: number;
  };
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
    coords: {
      lat: 0,
      long: 0,
    },
  },
  updateAdmin: (admin) => set(() => ({ admin })),
}));

export default useAdminStore;
