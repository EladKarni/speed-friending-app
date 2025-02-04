import { create } from "zustand";
import { createClient } from "../supabase/client";
import { EventType } from "../supabase/schema";

type UserStateType = {
  event_data: EventType | null;
  fetchEventData: (id: string) => void;
};

export const useEventStore = create<UserStateType>((set) => ({
  event_data: null,
  fetchEventData: async (event_id: string) => {
    const supabase = await createClient();
    const { data: events, error } = await supabase
      .from("events")
      .select("*")
      .eq("id", event_id)
      .single();
    if (!events) {
      return;
    }
    set({ event_data: events });
  },
}));
