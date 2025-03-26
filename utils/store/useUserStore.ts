import { create } from "zustand";
import { User } from "@supabase/supabase-js";
import {
  getCurrentUser,
  getMatchInfoData,
  getUserReadyStatus,
} from "@/app/userActions";
import { modifyAttendeeReadyForNextRound } from "@/app/actions";
import { MatchInfoType } from "../supabase/schema";

type UserStateType = {
  user_data: User | null;
  match_info: MatchInfoType | null;
  isReady: boolean;
  setUserData: (user_data: User) => void;
  fetchUserData: () => void;
  fetchMatchInfo: () => void;
  fetchReadyStatus: (user_id: string) => void;
  updateReadyStatus: (isReady: boolean) => void;
};

export const useUserStore = create<UserStateType>((set, get) => ({
  user_data: null,
  match_info: null,
  isReady: false,
  setUserData: (user_data: User) => set({ user_data }),
  fetchUserData: async () => {
    const user = await getCurrentUser();
    if (!user) {
      return;
    }
    set({ user_data: user });
  },
  fetchMatchInfo: async () => {
    const match_info = await getMatchInfoData(get().user_data!.id);
    if (!match_info) {
      return;
    }
    set({ match_info: match_info });
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
