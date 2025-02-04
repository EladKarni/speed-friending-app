import React from "react";
import MatchInfo from "../ui/matchInfo";
import ProfileCard from "../ui/profileCard";
import Image from "next/image";
import { EventType } from "@/utils/supabase/schema";

const MatchSearch = ({ event_data }: { event_data: EventType }) => {
  return (
    <>
      <div>
        <ProfileCard />
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
    </>
  );
};

export default MatchSearch;
