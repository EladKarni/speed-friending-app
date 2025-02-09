"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "flowbite-react";
import { redirect, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useEventStore } from "@/utils/store/useEventStore";
import AttendeeTable from "@/components/attendeeTable";
import { startNewRound, updateEventEntry } from "@/app/actions";
import { generateMatches, mergeObject } from "@/utils/utils";
import { Json } from "@/utils/supabase/schema";
import CopyLinkInput from "@/components/ui/copyLinkInput";

const EventPage = () => {
    const searchParams = useSearchParams();
    const event_id = searchParams.get("event_id");

    const event_data = useEventStore((state) => state.event_data);
    const event_attendees = useEventStore((state) => state.event_attendees);
    const readyAttendees = useEventStore((state) => state.ready_event_attendees);
    const eventStatus = useEventStore((state) => state.currentRoundStage);
    const currentRound = useEventStore((state) => state.currentRound);
    const skippedAttendees = useEventStore(
        (state) => state.skipped_event_attendees
    );

    const setNewEventData = useEventStore((state) => state.updateCurrentEvent);
    const updateSkippedAttendees = useEventStore(
        (state) => state.updateSkippedAttendees
    );
    const getEvent = useEventStore((state) => state.fetchEvent);
    const getEventAttendees = useEventStore((state) => state.fetchEventAttendees);
    const updateAttendeeStore = useEventStore(
        (state) => state.updateEventAttendees
    );
    const updateReadyAttendeesStore = useEventStore(
        (state) => state.updateReadyAttendees
    );
    const getReadyAttendees = useEventStore((state) => state.fetchReadyAttendees);

    if (!event_id) {
        redirect("/dashboard");
    }

    useEffect(() => {
        getEvent(event_id);
        getEventAttendees(event_id);
        getReadyAttendees(event_id);
    }, []);

    //Supabase subscription
    const supabase = createClient();
    supabase
        .channel("table_db_changes")
        .on(
            "postgres_changes",
            { event: "INSERT", schema: "public", table: "event_attendees" },
            updateAttendeeStore
        )
        .subscribe();

    supabase
        .channel("user_status_updates")
        .on(
            "postgres_changes",
            { event: "UPDATE", schema: "public", table: "round_participation" },
            updateReadyAttendeesStore
        )
        .subscribe();

    const devInfo = () => {
        return (
            <>
                <div>
                    Current round: {currentRound} <br />
                    Number of ready attendees: {readyAttendees.length}
                </div>
                <div>
                    <h2>Event is currently: {eventStatus}</h2>
                </div>
            </>
        );
    };

    if (!event_data) {
        return <div>Loading...</div>;
    }

    const handleNewRoundStart = async () => {
        const roundData = await startNewRound(event_data);
        if (!roundData) {
            console.error("No round data returned when starting round");
            return;
        }
        const readyAttendeesInfo = event_attendees.filter((attendee) =>
            readyAttendees.includes(attendee.id)
        );

        const generatedMatches = generateMatches(
            readyAttendeesInfo,
            skippedAttendees,
            roundData.id,
            (event_data.matches as Record<string, string[]>) || {},
            event_data.table_count,
            event_data.table_capacity,
            event_data.event_type || "Dating"
        );

        if (Object.keys(generatedMatches.newMatchList).length === 0) {
            console.log("No new matches generated");
            await supabase.from("event_rounds").delete().eq("id", roundData.id);
            return;
        }

        updateSkippedAttendees(generatedMatches.noMatchList);

        if (roundData && generatedMatches.matchInfoArray.length > 0) {
            let { error } = await supabase.from("event_round_matches").insert(
                generatedMatches.matchInfoArray.map((match) => ({
                    ...match,
                    match_info: match.match_info || {},
                }))
            );

            if (error) {
                console.error("Error inserting match data:", error);
                return;
            }

            ({ error } = await supabase.from("alerts").insert({
                event_id: roundData.event_id,
                related_data_id: roundData.id,
                alert_type: 'StartRound'
            }));

            if (error) {
                console.error("Error inserting match data:", error);
                return;
            }

        }

        const newMatchList = mergeObject([
            event_data.matches as Record<string, string[]>,
            generatedMatches.newMatchList,
        ]) as Json;

        const updatedEventData = await updateEventEntry(event_id, newMatchList);

        if (!updatedEventData) {
            return;
        }

        setNewEventData(updatedEventData);
    };

    return (
        <Card>
            <Link
                href={`/dashboard/event/share?event_id=${event_id}`}
                className="text-white text-center w-full bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
                Show QR
            </Link>
            <CopyLinkInput url={window.location.href} />
            <h2>Welcome to {event_data.event_name}</h2>

            <AttendeeTable
                event_attendees={event_attendees}
                readyAttendees={readyAttendees}
            />
            {devInfo()}
            <Button
                disabled={eventStatus !== "waiting"}
                className="w-full"
                onClick={handleNewRoundStart}
            >
                {eventStatus === "waiting"
                    ? "Start Round"
                    : `Current Stage: ${eventStatus}`}
            </Button>
        </Card>
    );
};

export default EventPage;
