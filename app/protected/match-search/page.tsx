import { Button, Card } from "flowbite-react";
import React from "react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import SearchCountdown from "@/components/ui/searchCountdown";
import Link from "next/link";
import ProfileCard from "@/components/ui/profileCard";
import MatchInfo from "@/components/ui/matchInfo";

const MatchSearchPage = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/");
  }

  const { data } = await supabase
    .from("events")
    .select("*")
    .eq("id", user.user_metadata.event_id)
    .single();

  if (!data) {
    return redirect("/");
  }

  const { data: round_info } = await supabase
    .from("event_rounds")
    .select("*")
    .eq("event_id", data.id)
    .single();

  if (!round_info) {
    return redirect("/");
  }

  const { round_started_at, round_timers } = round_info;
  const roundStart = new Date("2025-01-31T11:10:00").getTime();
  const currentTimer = round_timers[1] * 1000 + roundStart - Date.now();

  return (
    <section className="flex flex-col justify-between flex-1">
      <div>
        <ProfileCard />
        <MatchInfo />
        {data.event_map && (
          <div className="w-full relative h-96 flex-1 bg-slate-400">
            <Image
              src={`https://ysowurspnajoufhabtjt.supabase.co/storage/v1/object/public/${data.event_map}`}
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
          <Button className="mt-4 flex-1" color="gray" disabled>
            Not Found
          </Button>
          <Link href={"/protected/match"} className="mt-4 flex-1">
            <Button color="blue" className="w-full">
              Found
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default MatchSearchPage;
