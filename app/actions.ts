"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import getEvent from "@/utils/supabase/getEvent";
import { EventAttendeesType } from "@/utils/store/useEventStore";
import { EventType, Json } from "@/utils/supabase/schema";

export const AnonSignInAction = async (formData: FormData) => {
  const name = formData.get("name")?.toString();
  const email = formData.get("email")?.toString();
  const ticket_type = formData.get("ticket_type")?.toString();
  const event_id = formData.get("event")?.toString();

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInAnonymously({
    options: {
      data: {
        name: name,
        email: email,
        ticket_type: ticket_type,
        event_id: event_id,
      },
    },
  });

  if (error) {
    return "Error Authenticating!";
  }

  const user = data?.user;

  if (user) {
    const { error: inset_attendee_error } = await supabase
      .from("attendees")
      .insert({
        email: user.user_metadata.email,
        ticket_type: user.user_metadata.ticket_type,
        name: user.user_metadata.name,
      });
    if (inset_attendee_error) {
      console.log("Error inserting attendee!", inset_attendee_error);
      return "Error inserting attendee!";
    }
  }

  if (event_id) {
    const event = await getEvent(event_id);
    if (!event) {
      return "Event not found!";
    }
    if (!data.user?.id) {
      return "User not found!";
    }
    const result = await supabase
      .from("event_attendees")
      .insert({ event_id, attendee_id: data.user.id });

    if (result.error) {
      return "Error registering!";
    }
  }
  createAttendeeReadyForNextRound();
  return redirect("/protected/waiting-room");
};

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  } else {
    return encodedRedirect(
      "success",
      "/sign-up",
      "Thanks for signing up! Please check your email for a verification link."
    );
  }
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/protected");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

export const modifyAttendeeReadyForNextRound = async (isReady: boolean) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return;
  }
  const { data, error } = await supabase
    .from("round_participation")
    .update({
      is_ready: isReady,
    })
    .eq("attendee_id", user.id)
    .select("is_ready")
    .single();

  if (error) {
    console.log("Error updating round participation", error);
    return;
  }

  return data.is_ready;
};

export const createAttendeeReadyForNextRound = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return;
  }
  const { data, error } = await supabase
    .from("round_participation")
    .insert({
      attendee_id: user.id,
      event_id: user.user_metadata.event_id,
      is_ready: false,
    })
    .select("*")
    .single();
  return data;
};

export const setWillShareContactInfo = async (
  willShareValue: boolean,
  match_id: number
) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return;
  }
  const { data, error } = await supabase
    .from("event_round_matches")
    .update({
      willShare: willShareValue,
    })
    .eq("id", match_id);

  if (error) {
    console.log("Error updating attendee", error);
  }
};

export const fetchEventData = async (event_id: string) => {
  const supabase = await createClient();
  const { data: event, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", event_id)
    .single();

  if (error) {
    console.log("Error fetching event", error);
    return;
  }

  return event;
};

export const fetchOrginizersEvents = async (orginizer_id: string) => {
  const supabase = await createClient();
  const { data: events, error } = await supabase
    .from("events")
    .select("*")
    .eq("organizer", orginizer_id);

  if (error) {
    console.log("Error fetching event", error);
    return;
  }

  return events;
};

export const fetchEventAttendees = async (event_id: string) => {
  const supabase = await createClient();
  const { data: attendees, error } = await supabase
    .from("event_attendees")
    .select(
      `
      attendee_id,
      attendees ( ticket_type, id, name )
    `
    )
    .eq("event_id", event_id);

  if (error) {
    console.log("Error fetching event attendees", error);
    return;
  }

  return attendees;
};

export const fetchReadyAttendees = async (event_id: string) => {
  const supabase = await createClient();
  const { data: ready_attendees, error } = await supabase
    .from("round_participation")
    .select("*")
    .eq("event_id", event_id)
    .eq("is_ready", true);

  if (error) {
    console.log("Error fetching ready attendees", error);
    return;
  }

  return ready_attendees;
};

export const fetchAttendeesData = async (attendee_ids: string) => {
  const supabase = await createClient();
  const { data: attendee, error } = await supabase
    .from("attendees")
    .select("*")
    .eq("id", attendee_ids)
    .single();
  if (!attendee || attendee.ticket_type === null) {
    return;
  }
  const new_event_attendee_object = {
    id: attendee_ids,
    name: attendee.name,
    ticketAs: attendee.ticket_type,
  } as EventAttendeesType;
  return new_event_attendee_object;
};

export const startNewRound = async (event: EventType) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("event_rounds")
    .insert([
      {
        event_id: event.id,
        round_timers: [
          event.timer_start,
          event.timer_search,
          event.timer_chat,
          event.timer_wrapup,
        ],
      },
    ])
    .select()
    .single();
  if (error) {
    console.error(error);
    return;
  }
  return data;
};

export const updateEventEntry = async (
  event_id: string,
  newMatchList: Json
) => {
  const supabase = await createClient();
  const { data: updatedEvent, error: updateEventError } = await supabase
    .from("events")
    .update({
      matches: newMatchList,
    })
    .eq("id", event_id)
    .select("*")
    .single();

  if (updateEventError) {
    console.error(updateEventError);
    return;
  }
  return updatedEvent;
};