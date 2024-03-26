import { create } from "zustand";

type State = {
  adminId: string;
  adminEmail: string;
};

type Action = {
  setAdminId: (adminId: State["adminId"]) => void;
  setAdminEmail: (adminEmail: State["adminEmail"]) => void;
};

const updateAdminId = create<State & Action>((set) => ({
  adminId: "",
  adminEmail: "",
  setAdminId: (adminId) => set(() => ({ adminId: adminId })),
  setAdminEmail: (adminEmail) => set(() => ({ adminEmail: adminEmail })),
}));

export default updateAdminId;
