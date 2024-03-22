import { create } from "zustand";

export type User = {
  id: string;
  username: string;
};

type State = {
  user: User;
};

type Action = {
  setUser: (user: State["user"]) => void;
};

const useUserStore = create<State & Action>((set) => ({
  user: {
    id: "",
    username: "",
  },
  setUser: (user) => set(() => ({ user: user })),
}));

export default useUserStore;
