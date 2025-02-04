import { create } from "zustand";
import { User } from "@supabase/supabase-js";
import { createClient } from "../supabase/client";

type UserStateType = {
  user_data: User | null;
  setUserData: (user_data: User) => void;
  fetchUserData: () => void;
};

export const useUserStore = create<UserStateType>((set) => ({
  user_data: null,
  setUserData: (user_data: User) => set({ user_data }),
  fetchUserData: async () => {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    const user = data.user;
    if (!user) {
      return;
    }
    console.log(user);
    set({ user_data: user });
  },
}));
