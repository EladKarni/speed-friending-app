"use client";
import React from "react";
import MatchInfo from "../ui/matchInfo";
import Image from "next/image";
import { EventType } from "@/utils/supabase/schema";
import { Avatar, Button, Card } from "flowbite-react";
import { User } from "@supabase/supabase-js";

const MatchSearchPhase = ({
  event_data,
  attendee,
  setFound,
  notFoundLock,
}: {
  event_data: EventType;
  attendee: User;
  setFound: (isFound: boolean) => void;
  notFoundLock: boolean;
}) => {
  return (
    <div>
      <div>
        <Card className=" text-center">
          <Avatar rounded size="lg" img={attendee?.user_metadata.picture} />
          <span>{attendee?.user_metadata.name}</span>
          <span className="text-gray-400 text-sm font-normal font-['Inter'] leading-[21px]">
            Nerdy Patreon
          </span>
        </Card>
        <MatchInfo />
        {event_data.event_map && (
          <div className="w-full relative h-96 flex-1 bg-slate-400">
            <Image
              src={`https://ysowurspnajoufhabtjt.supabase.co/storage/v1/object/public/${event_data.event_map}`}
              fill
              alt="Map of event"
            />
          </div>
        )}
      </div>
      <div>
        <h5 className="mb-1 xl font-medium text-gray-700 dark:text-gray-400">
          Did you find your match?
        </h5>
        <div className="flex justify-between gap-4">
          <Button
            className="mt-4 flex-1"
            color="gray"
            onClick={() => setFound(false)}
            disabled={notFoundLock}
          >
            Not Found
          </Button>
          <Button
            color="blue"
            className="mt-4 flex-1"
            onClick={() => setFound(true)}
          >
            Found
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MatchSearchPhase;
