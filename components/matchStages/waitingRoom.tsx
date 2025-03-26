"use client";

import { modifyAttendeeReadyForNextRound } from "@/app/actions";
import { Card, Avatar } from "flowbite-react";
import ConfirmPrompt from "../ui/confirmPrompt";
import Image from "next/image";
import { User } from "@supabase/supabase-js";
import { EventType } from "@/utils/supabase/schema";

interface WaitingRoomPhaseProps {
  attendee: User;
  currentRoundPhase: string;
  event: EventType;
  isReady: boolean;
  updateReadyStatus: (status: boolean) => void;
}

const WaitingRoomPhase: React.FC<WaitingRoomPhaseProps> = ({
  attendee,
  currentRoundPhase,
  event,
  isReady,
  updateReadyStatus,
}) => {
  return (
    <div className="w-full flex flex-col gap-8">
      <Card className=" text-center">
        <Avatar rounded size="lg" img={attendee?.user_metadata.picture} />
        <span>{attendee?.user_metadata.name}</span>
        <span className="text-gray-400 text-sm font-normal font-['Inter'] leading-[21px]">
          Nerdy Patreon
        </span>
      </Card>
      <div>
        <h2>Current Phase: {currentRoundPhase}</h2>
      </div>
      <div className="mx-8 text-center">
        <h2 className="text-2xl">
          Waiting for <span className="text-blue-300">{event?.event_name}</span>{" "}
          to start
        </h2>
        <h3 className="text-lg text-slate-400">
          While you wait for the event to start, here is the event map
        </h3>
        <div className="relative aspect-auto w-full h-[500px] my-4">
          <Image
            src={`https://ysowurspnajoufhabtjt.supabase.co/storage/v1/object/public/${event?.event_map}`}
            alt="map of current event"
            fill
            objectFit="contain"
          />
        </div>
      </div>

      <div className="mx-8 text-center flex flex-col gap-4">
        <h2 className="text-xl">Ready for next round?</h2>
        <p>
          If you just want to take a break or use the restrooms, just stay on
          this page until you are ready
        </p>
        <ConfirmPrompt
          handleConfirm={async () => {
            const newStatus = await modifyAttendeeReadyForNextRound(!isReady);
            updateReadyStatus(!!newStatus);
          }}
          ConfirmBtnType={"button"}
          cancleText={"Leave Event"}
          confirmText={isReady ? "Not Ready" : "Ready"}
        />
        {isReady ? (
          <p className="text-green-500">You are ready for the next round</p>
        ) : (
          <p className="text-red-500">
            You are not enrolled for the next round
          </p>
        )}
      </div>
    </div>
  );
};

export default WaitingRoomPhase;
