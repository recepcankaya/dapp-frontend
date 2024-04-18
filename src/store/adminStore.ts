import { create } from "zustand";

export type Admin = {
  id: string;
  brandName: string;
  brandLogo: string;
  ticketImage: string;
  numberForReward: number;
  NFTSrc: string;
  contractAddress: string;
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
    ticketImage: "",
    numberForReward: 0,
    NFTSrc: "",
    contractAddress: "",
    coords: {
      lat: 0,
      long: 0,
    },
  },
  updateAdmin: (admin) => set(() => ({ admin })),
}));

export default useAdminStore;
