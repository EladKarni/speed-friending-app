import { create } from "zustand";
import { createClient } from "../supabase/client";
import { EventType } from "../supabase/schema";
import {
  fetchAttendeesData,
  fetchEventAttendees,
  fetchEventData,
  fetchReadyAttendees,
} from "@/app/actions";

export type EventAttendeesType = {
  id: string;
  name: string;
  ticketAs: string | "Women" | "Men";
};

type UserStateType = {
  event_data: EventType | null;
  event_attendees: EventAttendeesType[];
  ready_event_attendees: string[];
  skipped_event_attendees: string[];
  isEventActive: boolean;
  currentRoundStage: "waiting" | "matching" | "chatting" | "done";
  currentRound: number;
  fetchEvent: (id: string) => void;
  fetchEventAttendees: (id: string) => void;
  fetchReadyAttendees: (id: string) => void;
  updateCurrentEvent: (newEventData: EventType) => void;
  updateSkippedAttendees: (attendee_id: string[]) => void;
  updateEventAttendees: (new_attendee_alert: any) => void;
  updateReadyAttendees: (new_attendee_alert: any) => void;
};

const supabase = createClient();

export const useEventStore = create<UserStateType>((set) => ({
  event_data: null,
  event_attendees: [],
  ready_event_attendees: [],
  skipped_event_attendees: [],
  isEventActive: false,
  currentRoundStage: "waiting",
  currentRound: 1,
  fetchEvent: async (event_id) => {
    const event = await fetchEventData(event_id);
    if (!event) {
      return;
    }
    set({ event_data: event });
  },
  fetchEventAttendees: async (event_id) => {
    const event = await fetchEventAttendees(event_id);
    if (!event) {
      return;
    }
    const attendees = event.map((attendee) => {
      return {
        id: attendee.attendee_id,
        name: attendee.attendees.name,
        ticketAs: attendee.attendees.ticket_type || "Men",
      };
    });

    set({ event_attendees: attendees });
  },
  fetchReadyAttendees: async (event_id) => {
    const readyAttendees = await fetchReadyAttendees(event_id);
    if (!readyAttendees) {
      return;
    }
    set({
      ready_event_attendees: readyAttendees.map(
        (attendee) => attendee.attendee_id
      ),
    });
  },
  updateCurrentEvent: (newEventData) => {
    set((state) => ({
      event_data: newEventData,
    }));
  },
  updateSkippedAttendees: (attendee_id) =>
    set((state) => ({
      skipped_event_attendees: [
        ...state.skipped_event_attendees,
        ...attendee_id,
      ],
    })),
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