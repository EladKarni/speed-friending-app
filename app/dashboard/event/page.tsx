"use client";

import { Button } from "@/components/ui/button";
import { Card, Dropdown, DropdownItem } from "flowbite-react";
import { HiShare, HiChevronDown } from "react-icons/hi";

import React, { useEffect } from "react";
import { redirect, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useEventStore } from "@/utils/store/useEventStore";
import AttendeeTable from "@/components/attendeeTable";

const EventPage = () => {
  const searchParams = useSearchParams();
  const event_id = searchParams.get("event_id");

  const event_data = useEventStore((state) => state.event_data);
  const event_attendees = useEventStore((state) => state.event_attendees);
  const readyAttendees = useEventStore((state) => state.ready_event_attendees);
  const eventStatus = useEventStore((state) => state.currentRoundStage);
  const currentRound = useEventStore((state) => state.currentRound);

  const getEvent = useEventStore((state) => state.fetchEvent);
  const updateAttendeeStore = useEventStore(
    (state) => state.updateEventAttendees
  );
  const updateReadyAttendeesStore = useEventStore(
    (state) => state.updateReadyAttendees
  );

  if (!event_id) {
    redirect("/dashboard");
  }

  useEffect(() => {
    getEvent(event_id);
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

  return (
    <Card>
      <Link
        href={`/dashboard/event/share?event_id=${event_id}`}
        className="text-white text-center w-full bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Show QR
      </Link>
      <div className="flex gap-4">
        <Dropdown
          label=""
          dismissOnClick={false}
          renderTrigger={() => (
            <Button variant="ghost" className="border border-gray-500 w-full">
              <HiChevronDown size={24} /> Actions
            </Button>
          )}
        >
          <DropdownItem>Friend</DropdownItem>
          <DropdownItem>Dating</DropdownItem>
          <DropdownItem>Other</DropdownItem>
        </Dropdown>
        <Button>
          <HiShare />
        </Button>
      </div>
      <h2>Welcome to {event_data.event_name}</h2>

      <AttendeeTable
        event_attendees={event_attendees}
        readyAttendees={readyAttendees}
      />
      {devInfo()}
      <Button
        disabled={eventStatus !== "waiting"}
        className="w-full"
        onClick={async () => {
          // const { data, error } = await supabase
          //   .from("event_rounds")
          //   .insert([
          //     {
          //       event_id: event_id ?? "",
          //       round_timers: [
          //         event.timer_start,
          //         event.timer_search,
          //         event.timer_chat,
          //         event.timer_wrapup,
          //       ],
          //     },
          //   ])
          //   .select()
          //   .single();
          // if (error) {
          //   console.error(error);
          //   return;
          // }
          // // create an array of only ready attendees
          // const readyAttendeesInfo = event_attendees.filter((attendee) =>
          //   readyAttendees.includes(attendee.id)
          // );
          // const generatedMatches = generateMatches(
          //   readyAttendeesInfo,
          //   skippedAttendees,
          //   data.id,
          //   (event.matches as Record<string, string[]>) || {},
          //   event.table_count,
          //   event.table_capacity,
          //   event.event_type || "Dating"
          // );
          // if (Object.keys(generatedMatches.newMatchList).length === 0) {
          //   console.log("No new matches generated");
          //   await supabase.from("event_rounds").delete().eq("id", data.id);
          //   setEventStatus("Inactive");
          //   return;
          // }
          // console.log({ generatedMatches });
          // setSkippedAttendees(generatedMatches.noMatchList);
          // if (data) {
          //   const { error } = await supabase
          //     .from("event_round_matches")
          //     .insert(generatedMatches.matchInfoArray);
          // }
          // if (error) {
          //   return;
          // }
          // const newMatchList = mergeObject([
          //   event.matches as Record<string, string[]>,
          //   generatedMatches.newMatchList,
          // ]);
          // console.log("new combined matches: ", newMatchList);
          // console.log("Previous match list: ", event.matches);
          // console.log(
          //   "new matches from round: ",
          //   generatedMatches.newMatchList
          // );
          // const { data: updatedEvent, error: updateEventError } = await supabase
          //   .from("events")
          //   .update({
          //     matches: newMatchList,
          //   })
          //   .eq("id", event_id)
          //   .select("*")
          //   .single();
          // if (updateEventError) {
          //   console.error(updateEventError);
          //   return;
          // }
          // setEvent({ ...event, matches: newMatchList });
        }}
      >
        {eventStatus === "waiting"
          ? "Start Round"
          : `Current Stage: ${eventStatus}`}
      </Button>
    </Card>
  );
};

export default EventPage;
