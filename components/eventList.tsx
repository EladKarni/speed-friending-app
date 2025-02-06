import { EventType } from "@/utils/supabase/schema";
import { Card } from "flowbite-react";
import Link from "next/link";
import React from "react";

const EventList = ({ events }: { events: EventType[] }) => {
  const sortedEvents = events?.sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return (
    <div className="mx-8 text-center text-gray-400 text-lg">
      {sortedEvents && sortedEvents?.length > 0 ? (
        <>
          <h2 className="text-2xl mb-4">Your Events</h2>
          <div className="flex flex-col gap-4">
            {sortedEvents?.map((event) => {
              return (
                <Link
                  href={`/dashboard/event?event_id=${event.id}`}
                  key={event.id}
                >
                  <Card
                    key={event.id}
                    className="flex justify-between items-center"
                  >
                    <div className="text-slate-200">{event.event_name}</div>
                    <div>
                      Created on{" "}
                      <span className="italic text-slate-200">
                        {new Date(event.created_at).toDateString()}
                      </span>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </>
      ) : (
        <span>
          No Previous Events
          <br />
          Please join an event and come back to view the results after it
        </span>
      )}
    </div>
  );
};

export default EventList;
