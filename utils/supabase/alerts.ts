import { createClient } from "../supabase/client";

export async function subscribeAlert(callback: (payload: any) => any) {
    const supabase = await createClient();
    supabase
        .channel("event_round")
        .on(
            "postgres_changes",
            { event: "INSERT", schema: "public", table: "alerts" },
            (payload) => {
                console.log("first");
                callback(payload.new);
            }
        )
        .subscribe();

}

export async function getMostRecentAlert(eventId: string, roundId: string) {
    const supabase = await createClient();
    console.debug('Event Id and round Id', eventId, roundId);
    const { data: alert, error } = await supabase
        .from("alerts")
        .select("*")
        .eq("event_id", eventId)
        .eq("related_data_id", roundId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
    if (error) {
        console.error("Error retrieving most recent alert", error);
    }
    return alert;

}
