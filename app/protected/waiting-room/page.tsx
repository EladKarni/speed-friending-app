"use client";

import { fetchEventData } from "@/app/actions";
import { useUserStore } from "@/utils/store/useUserStore";
import { EventRoundPhase, EventType } from "@/utils/supabase/schema";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import MatchSearch from "@/components/matchStages/matchSearch";
import WaitingRoomPhase from "@/components/matchStages/waitingRoom";
import MatchPage from "@/components/matchStages/matchChat";
import ChattingPhase from "@/components/matchStages/matchChat";
import { getMostRecentAlert } from "@/utils/supabase/alerts";

const WaitingRoom = () => {
  const attendee = useUserStore((state) => state.user_data);
  const isReady = useUserStore((state) => state.isReady);
  const getUserStore = useUserStore((state) => state.fetchUserData);
  const getReadyStatus = useUserStore((state) => state.fetchReadyStatus);
  const updateReadyStatus = useUserStore((state) => state.updateReadyStatus);

  const [event, setEvent] = useState<EventType>();
  const [isNotFoundLocked, setIsNotFoundLocked] = useState<boolean>(true);

  const [currentRoundPhase, setCurrentRoundPhase] =
    useState<EventRoundPhase>("RoundEnded");

  useEffect(() => {
    const fetchUser = async () => {
      await getUserStore();
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const setup = async () => {
      if (!attendee) {
        return;
      }
      const lastAlert = await getMostRecentAlert(
        attendee.user_metadata.event_id
      );
      await getReadyStatus(attendee.id);
      const event = await fetchEventData(attendee!.user_metadata.event_id);
      console.log(event);
      if (event) {
        setEvent(event);
      }
      if (lastAlert) {
        setCurrentRoundPhase(lastAlert.alert_type);
      }
    };
    setup();
  }, [attendee]);

  if (!attendee || !event) {
    return <div>Loading...</div>;
  }

  const handleMatchFound = (isFound: boolean) => {
    if (isFound) {
      setCurrentRoundPhase("ChattingPhase");
    }
    // handle not found scenario
  };

  // Subscribe to changes in the round_participation & event_round_matches tables
  const listenToAlertChanges = (payload: any) => {
    const { alert_type, event_id } = payload.new;
    if (event_id !== attendee?.user_metadata.event_id) return; // Ignore events not related to the current
    if (alert_type === "ChattingPhase") {
      setIsNotFoundLocked(false); // Ignore ChattingPhase since it's handled when the user clicks the found
      return;
    }
    setCurrentRoundPhase(alert_type);
  };

  //Supabase subscription
  const supabase = createClient();
  supabase
    .channel("round_phases_changes")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "alerts" },
      listenToAlertChanges
    )
    .subscribe();

  if (currentRoundPhase === "StartRound") {
    return (
      <div>
        <h2>Round is starting...</h2>
        <p>Get ready to start the round</p>
      </div>
    );
  }

  if (currentRoundPhase === "LocatingPhase") {
    return (
      <MatchSearch
        event_data={event}
        attendee={attendee}
        setFound={handleMatchFound}
        notFoundLock={isNotFoundLocked}
      />
    );
  }

  if (currentRoundPhase === "ChattingPhase") {
    return <ChattingPhase attendee={attendee} />;
  }

  if (currentRoundPhase === "PostMatchPhase") {
    return <div>Post Match Phase</div>;
  }

  if (currentRoundPhase === "RoundEnded") {
    return (
      <WaitingRoomPhase
        attendee={attendee}
        currentRoundPhase={currentRoundPhase}
        event={event}
        isReady={isReady}
        updateReadyStatus={updateReadyStatus}
      />
    );
  }
};

export default WaitingRoom;
