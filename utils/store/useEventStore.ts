import { create } from "zustand";
import { createClient } from "../supabase/client";
import { EventType } from "../supabase/schema";
import { fetchAttendeesData, fetchEventData } from "@/app/actions";

export type EventAttendeesType = {
  id: string;
  name: string;
  ticketAs: string | "Women" | "Men";
};

type UserStateType = {
  event_data: EventType | null;
  event_attendees: EventAttendeesType[];
  ready_event_attendees: string[];
  isEventActive: boolean;
  currentRoundStage: "waiting" | "matching" | "chatting" | "done";
  currentRound: number;
  updateEventData: (event: EventType) => void;
  fetchEvent: (id: string) => void;
  updateEventAttendees: (new_attendee_alert: any) => void;
  updateReadyAttendees: (new_attendee_alert: any) => void;
};

const supabase = createClient();

export const useEventStore = create<UserStateType>((set) => ({
  event_data: null,
  event_attendees: [],
  ready_event_attendees: [],
  isEventActive: false,
  currentRoundStage: "waiting",
  currentRound: 1,
  updateEventData: (new_event_data) =>
    set((state) => ({ event_data: new_event_data })),
  fetchEvent: async (event_id) => {
    const event = await fetchEventData(event_id);
    if (!event) {
      return;
    }
    set({ event_data: event });
  },
  updateEventAttendees: async (new_event_attendees_payload) => {
    if (!new_event_attendees_payload || !new_event_attendees_payload.new) {
      return;
    }
    const attendee = await fetchAttendeesData(
      new_event_attendees_payload.new.attendee_id
    );
    if (!attendee) {
      return;
    }
    set((state) => ({
      event_attendees: [...state.event_attendees, attendee],
    }));
  },
  updateReadyAttendees: async (new_ready_attendees_payload) => {
    if (!new_ready_attendees_payload || !new_ready_attendees_payload.new) {
      return;
    }

    if (new_ready_attendees_payload.new.is_ready) {
      set((state) => ({
        ready_event_attendees: [
          ...state.ready_event_attendees,
          new_ready_attendees_payload.new.attendee_id,
        ],
      }));
    } else {
      set((state) => ({
        ready_event_attendees: state.ready_event_attendees.filter(
          (id) => id !== new_ready_attendees_payload.new.attendee_id
        ),
      }));
    }
  },
}));