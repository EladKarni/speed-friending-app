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
