import { Session } from "@supabase/supabase-js";
import { create } from "zustand";

type State = {
  session: Session | null;
};

type Action = {
  updateSession: (session: State["session"]) => void;
};

const useSession = create<State & Action>((set) => ({
  session: localStorage.getItem("session")
    ? JSON.parse(localStorage.getItem("session")!)
    : null,
  updateSession: (session) => set(() => ({ session })),
}));

export default useSession;
