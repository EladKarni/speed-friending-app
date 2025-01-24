import { createClient } from "@/utils/supabase/server";

export default async function getEvent(event_id: string) {
  const supabase = await createClient();
  const { data: events, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", event_id);

  if (error) {
    throw error;
  }

  if (events && events[0].id !== event_id) {
    return null;
  }
  return events[0];
}
