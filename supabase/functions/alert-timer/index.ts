// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
//import { createClient } from 'jsr:@supabase/supabase-js@2'

import * as postgres from 'https://deno.land/x/postgres@v0.17.0/mod.ts'


const databaseUrl = Deno.env.get('SUPABASE_DB_URL')!
const pool = new postgres.Pool(databaseUrl, 3, true)

const insertAlert = async (connection: any, eventId: string, alertType: string, roundId: string) => {
    await connection.queryObject`INSERT INTO alerts (event_id, alert_type, related_data_id) VALUES (${eventId}, ${alertType}, ${roundId})`;
}

const processEventsIfNeeded = async (connection: any, eventId: string, roundId: string, timings: number[]) => {
    const result = await connection.queryObject`SELECT * FROM alerts WHERE event_id = ${eventId} AND related_data_id = ${roundId} ORDER BY created_at ASC`;
    const rows = result.rows;
    if (rows.length > 0) {
        var lastEvent = rows.pop();
        const alertType = lastEvent.alert_type;
        const lastEventTime = lastEvent.created_at;
        const currentTime = Date.now();
        const timeDiff = (currentTime - lastEventTime) / 1000;
        console.debug(`Time diff: ${timeDiff}`);
        let duration = null;
        switch (alertType) {
            case 'StartRound':
                duration = timings[0];
                if (timeDiff >= duration) {
                    await insertAlert(connection, eventId, 'LocatingPhase', roundId);
                }
                break;
            case 'LocatingPhase':
                duration = timings[1];
                if (timeDiff >= duration) {
                    await insertAlert(connection, eventId, 'ChattingPhase', roundId);
                }
                break;
            case 'ChattingPhase':
                duration = timings[2];
                if (timeDiff >= duration) {
                    await insertAlert(connection, eventId, 'PostMatchPhase', roundId);
                }
                break;
            case 'PostMatchPhase':
                duration = timings[3];
                if (timeDiff >= duration) {
                    await insertAlert(connection, eventId, 'RoundEnded', roundId);
                    await connection.queryObject`UPDATE event_rounds SET round_ended_at = NOW() WHERE id = ${roundId}`;
                }
                // update the round information with the final date so we don't keep pulling this one
                break;
            case 'RoundEnded':
                break;
            case 'EventEnded':
                break;
        }

    }
    else {
        console.debug(`No rows found for eventId waiting on the ${eventId}`);
    }


}


Deno.serve(async (req) => {

    const connection = await pool.connect()

    try {

        const result = await connection.queryObject`SELECT * FROM event_rounds WHERE round_ended_at IS NULL`;
        const active_rounds = result.rows;
        console.log("Processing active rounds:", active_rounds.length);

        active_rounds.forEach(async (round: any) => await processEventsIfNeeded(connection, round.event_id, round.id, round.round_timers));


    } catch (err) {
        console.error("Error with postgres query", err)
    }
    finally {
        connection.release();
    }

    const { name } = await req.json()
    const data = {
        message: `success`,
    }


    return new Response(
        JSON.stringify(data),
        { headers: { "Content-Type": "application/json" } },
    )
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/alert-timer' \
    --header 'Authorization: Bearer ' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
