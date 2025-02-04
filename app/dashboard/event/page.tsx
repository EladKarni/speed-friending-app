"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  Dropdown,
  DropdownItem,
  Table,
  TableBody,
  TableHead,
  TableHeadCell,
} from "flowbite-react";
import { HiShare, HiChevronDown } from "react-icons/hi";

import React, { useEffect, useState } from "react";
import TableEntry from "@/components/ui/tableEntry";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { EventType } from "@/utils/supabase/schema";
import { delay, generateMatches, mergeObject } from "@/utils/utils";

const GuestList = () => {
  const supabase = createClient();
  const searchParams = useSearchParams();
  const event_id = searchParams.get("event_id");
  const [event, setEvent] = useState<EventType>();
  const [event_attendees, setEventAttendees] = useState<
    { id: string; name: string; ticketAs: string | "Women" | "Men" }[]
  >([]);
  const [readyAttendees, setReadyAttendees] = useState<string[]>([]);
  const [skippedAttendees, setSkippedAttendees] = useState<string[]>([]);
  const [eventStatus, setEventStatus] = useState<"Active" | "Inactive">(
    "Inactive"
  );
  const [currentRound, setCurrentRound] = useState<number | null>(1);
  const router = useRouter();
  const handleAttendeesUpdated = async (payload: any) => {
    if (!payload || !payload.new) {
      return;
    }
    const { data: attendee, error } = await supabase
      .from("attendees")
      .select("*")
      .eq("id", payload.new.attendee_id)
      .single();
    if (!attendee || attendee.ticket_type === null) {
      return;
    }
    setEventAttendees((prev) => [
      ...prev,
      {
        id: attendee.id,
        name: attendee.name,
        ticketAs: attendee.ticket_type || "Other",
      },
    ]);
  };

  if (!event_id) {
    redirect("/dashboard");
  }

  supabase
    .channel("table_db_changes")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "event_attendees" },
      handleAttendeesUpdated
    )
    .subscribe();

  useEffect(() => {
    const fetchEventInfo = async () => {
      const { data: events, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", event_id)
        .single();

      const { data: eventRounds, error: eventRoundsError } = await supabase
        .from("event_rounds")
        .select("*")
        .eq("event_id", event_id)
        .order("round_started_at", { ascending: false });

      if (eventRounds && eventRounds.length > 0) {
        console.log("active events: ", eventRounds.length);
        setCurrentRound(eventRounds.length);
        const latestRound = eventRounds[0];
        if (!eventRoundsError && latestRound && latestRound.round_started_at) {
          const now = new Date();
          const roundStartedAt = new Date(latestRound.round_started_at);
          const roundEndedAt = new Date(
            roundStartedAt.getTime() +
              latestRound.round_timers.reduce((a, b) => a + b) * 1000
          );
          if (now >= roundStartedAt && now <= roundEndedAt) {
            setEventStatus("Active");
          } else {
            setEventStatus("Inactive");
          }
        }
      }

      const { data: readyAttendees, error: readyAttendeesError } =
        await supabase
          .from("round_participation")
          .select("*")
          .eq("event_id", event_id)
          .eq("is_ready", true);

      if (readyAttendees) {
        setReadyAttendees(
          readyAttendees.map((attendee) => attendee.attendee_id)
        );
      }

      const { data: attendees, error: attendeeError } = await supabase
        .from("event_attendees")
        .select(
          `
          attendee_id,
          attendees ( date_of_birth, email, ticket_type, id, joined_on, name )
        `
        )
        .eq("event_id", event_id);

      if (attendees && attendees.length > 0) {
        setEventAttendees(
          attendees.map((attendee) => {
            return {
              id: attendee.attendee_id,
              name: attendee.attendees.name,
              ticketAs: attendee.attendees.ticket_type || "Men",
            };
          })
        );
      }

      if (error) {
        console.error(error);
      }

      if (events) {
        setEvent(events);
      }
    };
    fetchEventInfo();
  }, []);

  supabase
    .channel("user_status_updates")
    .on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "round_participation" },
      (payload) => {
        if (!payload || !payload.new) {
          return;
        } else if (payload.new.is_ready) {
          setReadyAttendees((prev) => [...prev, payload.new.attendee_id]);
        } else {
          setReadyAttendees((prev) =>
            prev.filter((id) => id !== payload.new.attendee_id)
          );
        }
      }
    )
    .subscribe();

  supabase
    .channel("round_updates")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "event_rounds" },
      async (payload) => {
        if (!payload || !payload.new) {
          return;
        }
        console.log("Change Detected");

        const lastRound = payload.new;
        const now = new Date();
        const roundStartedAt = new Date(lastRound.round_started_at);
        const roundEndedAt = new Date(
          roundStartedAt.getTime() +
            lastRound.round_timers.reduce((a: any, b: any) => a + b) * 1000
        );

        if (roundEndedAt.getTime() - now.getTime() > 0) {
          setEventStatus("Active");
          await delay(roundEndedAt.getTime() - now.getTime());
          setEventStatus("Inactive");
        } else {
          setEventStatus("Inactive");
        }
      }
    )
    .subscribe();

  return (
    <Card>
      <form className="w-full mx-auto flex flex-col gap-4">
        <div className="relative">
          <div className="absolute inset-y-0 end-4 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            id="default-search"
            className="block w-full p-4 ps-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search Guest List"
            required
          />
        </div>
      </form>
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
      <h2>Welcome to {event?.event_name}</h2>

      <div className="overflow-x-auto">
        <Table>
          <TableHead>
            <TableHeadCell>Name</TableHeadCell>
            <TableHeadCell>Ready</TableHeadCell>
            <TableHeadCell>Ticket</TableHeadCell>
            <TableHeadCell>
              <span className="sr-only">Edit</span>
            </TableHeadCell>
          </TableHead>
          <TableBody className="divide-y">
            {event_attendees && event_attendees.length > 0 ? (
              event_attendees.map(({ name, id, ticketAs }) => (
                <TableEntry
                  name={name}
                  ready={readyAttendees.includes(id)}
                  ticket={ticketAs}
                  key={id}
                />
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center p-4">
                  This event has no users
                </td>
              </tr>
            )}
          </TableBody>
        </Table>
      </div>
      <div>
        Current round: {currentRound} <br />
        Number of ready attendees: {readyAttendees.length}
      </div>
      <div>
        <h2>Event is currently: {eventStatus}</h2>
      </div>
      <Button
        disabled={eventStatus === "Active"}
        className="w-full"
        onClick={async () => {
          if (!event) {
            return;
          }
          const { data, error } = await supabase
            .from("event_rounds")
            .insert([
              {
                event_id: event_id ?? "",
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

          // create an array of only ready attendees
          const readyAttendeesInfo = event_attendees.filter((attendee) =>
            readyAttendees.includes(attendee.id)
          );

          const generatedMatches = generateMatches(
            readyAttendeesInfo,
            skippedAttendees,
            data.id,
            (event.matches as Record<string, string[]>) || {},
            event.table_count,
            event.table_capacity,
            event.event_type || "Dating"
          );

          if (Object.keys(generatedMatches.newMatchList).length === 0) {
            console.log("No new matches generated");
            await supabase.from("event_rounds").delete().eq("id", data.id);
            setEventStatus("Inactive");
            return;
          }

          console.log({ generatedMatches });
          setSkippedAttendees(generatedMatches.noMatchList);

          if (data) {
            const { error } = await supabase
              .from("event_round_matches")
              .insert(generatedMatches.matchInfoArray);
          }
          if (error) {
            return;
          }

          const newMatchList = mergeObject([
            event.matches as Record<string, string[]>,
            generatedMatches.newMatchList,
          ]);

          console.log("new combined matches: ", newMatchList);
          console.log("Previous match list: ", event.matches);
          console.log(
            "new matches from round: ",
            generatedMatches.newMatchList
          );

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

          setEvent({ ...event, matches: newMatchList });
        }}
      >
        {eventStatus === "Inactive" ? "Start Event" : "Round In Progress"}
      </Button>
    </Card>
  );
};

export default GuestList;
