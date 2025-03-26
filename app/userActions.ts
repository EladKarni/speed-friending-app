"use server";
import { createClient } from "@/utils/supabase/server";

export const getCurrentUser = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.log("No user found");
    return;
  }

  return user;
};

export const getMatchInfoData = async (attendee_id: string) => {
  const supabase = await createClient();

  const { data: attendee_match } = await supabase
    .from("event_round_matches")
    .select("*")
    .eq("attendee_id", attendee_id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (!attendee_match) {
    console.log("No match found");
    return null;
  }

  return attendee_match;
};

export const getUserReadyStatus = async (attendee_id: string) => {
  const supabase = await createClient();

  const { data: isReady } = await supabase
    .from("round_participation")
    .select("is_ready")
    .eq("attendee_id", attendee_id)
    .single();

  if (isReady) {
    return isReady.is_ready;
  }
  return isReady;
};
