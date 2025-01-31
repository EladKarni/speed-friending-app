"use client";
import { modifyAttendeeReadyForNextRound } from "@/app/actions";
import ConfirmPrompt from "@/components/ui/confirmPrompt";
import { createClient } from "@/utils/supabase/client";
import { EventType } from "@/utils/supabase/schema";
import { User } from "@supabase/supabase-js";
import { Card, Avatar } from "flowbite-react";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const WaitingRoom = () => {
  const supabase = createClient();
  const [isReady, setIsReady] = useState(false);
  const [event, setEvent] = useState<EventType>();
  const [attendee, setAttendee] = useState<User>();
  const rounter = useRouter();
  useEffect(() => {
    const setup = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        return;
      }
      setAttendee(user);
      const { data: isReady, error: isReadyError } = await supabase
        .from("round_participation")
        .select("is_ready")
        .eq("attendee_id", user.id)
        .single();
      if (isReady) {
        setIsReady(isReady.is_ready);
      }
      const { data: event, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", user.user_metadata.event_id)
        .single();
      if (event) {
        setEvent(event);
      }
    };
    setup();
  }, []);

  supabase
    .channel("user_status_updates")
    .on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "round_participation" },
      (payload) => {
        if (!payload || !payload.new) {
          return;
        }
        if (payload.new.attendee_id === attendee?.id) {
          setIsReady(payload.new.is_ready);
        }
      }
    )
    .subscribe();

  supabase
    .channel("new_round_started")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "event_round_matches" },
      (payload) => {
        if (payload.new.attendee_id === attendee?.id) {
          rounter.push(`/protected/attendee-match`);
        }
      }
    )
    .subscribe();

  return (
    <div className="w-full flex flex-col gap-8">
      <Card className=" text-center">
        <Avatar rounded size="lg" img={attendee?.user_metadata.picture} />
        <span>{attendee?.user_metadata.name}</span>
        <span className="text-gray-400 text-sm font-normal font-['Inter'] leading-[21px]">
          Nerdy Patreon
        </span>
      </Card>
      <div className="mx-8 text-center">
        <h2 className="text-2xl">
          Waiting for <span className="text-blue-300">{event?.event_name}</span>{" "}
          to start
        </h2>
        <h3 className="text-lg text-slate-400">
          While you wait for the event to start, here is the event map
        </h3>
        <img
          src={`https://ysowurspnajoufhabtjt.supabase.co/storage/v1/object/public/${event?.event_map}`}
          alt="map of current event"
        />
      </div>

      <div className="mx-8 text-center flex flex-col gap-4">
        <h2 className="text-xl">Ready for next round?</h2>
        <p>
          If you just want to take a break or use the restrooms, just stay on
          this page until you are ready
        </p>
        <ConfirmPrompt
          handleConfirm={modifyAttendeeReadyForNextRound.bind(
            null,
            isReady ? false : true
          )}
          ConfirmBtnType={"button"}
          cancleText={"Leave Event"}
          confirmText={isReady ? "Not Ready" : "Ready"}
        />
        {isReady && (
          <p className="text-green-500">You are ready for the next round</p>
        )}
      </div>
    </div>
  );
};

export default WaitingRoom;
