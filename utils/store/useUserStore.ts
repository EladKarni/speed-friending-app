import { create } from "zustand";
import { User } from "@supabase/supabase-js";
import { getCurrentUser, getUserReadyStatus } from "@/app/userActions";
import { modifyAttendeeReadyForNextRound } from "@/app/actions";

type UserStateType = {
  user_data: User | null;
  isReady: boolean;
  setUserData: (user_data: User) => void;
  fetchUserData: () => void;
  fetchReadyStatus: (user_id: string) => void;
  updateReadyStatus: (isReady: boolean) => void;
};

export const useUserStore = create<UserStateType>((set, get) => ({
  user_data: null,
  isReady: false,
  setUserData: (user_data: User) => set({ user_data }),
  fetchUserData: async () => {
    console.log("second");
    const user = await getCurrentUser();
    if (!user) {
      return;
    }
    set({ user_data: user });
  },
  fetchReadyStatus: async (user_id) => {
    console.log(user_id);
    const isReady = await getUserReadyStatus(user_id);

    set({ isReady: !!isReady });
  },
  updateReadyStatus: async (isReady: boolean) => {
    set({ isReady: isReady });
  },
}));
