"use client";
import QRCode from "react-qr-code";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { cn } from "@/utils/cn";
import SearchCountdown from "@/components/ui/searchCountdown";
import { createClient } from "@/utils/supabase/client";

const SharePage = () => {
  const searchParams = useSearchParams();
  const event_id = searchParams.get("event_id");
  const [currentRoundPhase, setCurrentRoundPhase] = useState<0 | 1 | 2 | 3 | 4>(
    0
  );
  const [currentTimerStart, setCurrentTimerStart] = useState(0);

  const updateCurrentRoundPhase = (payload: any) => {
    const {
      alert_type,
      created_at,
      related_data_id,
      event_id,
      associated_data,
    } = payload.new;
    console.log(
      alert_type,
      created_at,
      related_data_id,
      event_id,
      associated_data
    );

    if (event_id !== event_id) return; // Ignore events not related to the current event

    if (alert_type === "StartRound") {
      setCurrentRoundPhase(0); // Set to 1 for the Locating Phase
      setCurrentTimerStart(0); // Reset timer for the next round
    }
    if (alert_type === "LocatingPhase") {
      setCurrentRoundPhase(1); // Set to 1 for the Locating Phase
      setCurrentTimerStart(associated_data); // Reset timer for the next round
    }
    if (alert_type === "ChattingPhase") {
      setCurrentRoundPhase(2); // Set to 2 for the Chatting Phase
      setCurrentTimerStart(associated_data); // Reset timer for the next round
    }
    if (alert_type === "PostMatchPhase") {
      setCurrentRoundPhase(3); // Set to 3 for the Post Match Phase
      setCurrentTimerStart(associated_data); // Reset timer for the next round
    }
    if (alert_type === "RoundEnded") {
      setCurrentRoundPhase(4); // Set to 4 for the Round Ended Phase
      setCurrentTimerStart(associated_data); // Reset timer for the next round
    }
  };

  //Supabase subscription
  const supabase = createClient();
  supabase
    .channel("round_phases_changes")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "alerts" },
      updateCurrentRoundPhase
    )
    .subscribe();

  if (!event_id) {
    return <div>No event selected</div>;
  }

  return (
    <div className="max-w-md mx-auto grid gap-4 h-full justify-between">
      <h1 className="text-2xl text-center text-slate-800 dark:text-slate-100">
        Scan This Link To Join The Next Round
      </h1>
      <QRCode
        size={512}
        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
        value={`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/event?event_id=${event_id}`}
        viewBox={`0 0 256 256`}
      />
      <SearchCountdown
        secondsRemaining={currentTimerStart}
        currentPhase={currentRoundPhase}
      />

      <ul className="steps text-xl">
        <li className={cn("step", currentRoundPhase > 0 && "step-accent")}>
          <span className="step-icon text-4xl m-2">🕵️‍♂️</span>
          <p className="m-2">Finding Match</p>
        </li>
        <li className={cn("step", currentRoundPhase > 1 && "step-accent")}>
          <span className="step-icon text-4xl m-2">🎤</span>
          <p className="m-2">Chatting</p>
        </li>
        <li className={cn("step", currentRoundPhase > 2 && "step-accent")}>
          <span className="step-icon text-4xl m-2">🗃</span>
          <p className="m-2">Post Match</p>
        </li>
      </ul>
    </div>
  );
};

export default SharePage;
