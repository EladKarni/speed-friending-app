"use client";
import { delay } from "@/utils/utils";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const SearchCountdown = ({
  roundStart,
  chatTimer,
}: {
  roundStart: string;
  chatTimer: number[];
}) => {
  const now = new Date();
  const roundStartedAt = new Date(roundStart);
  const roundEndsAt = new Date(
    roundStartedAt.getTime() +
      (chatTimer[0] + chatTimer[1] + chatTimer[2] * 1000)
  );
  const [currentTime, setCurrentTime] = useState(
    new Date(roundEndsAt.getTime() - now.getTime())
  );

  const router = useRouter();

  useEffect(() => {
    if (roundEndsAt.getTime() < now.getTime()) {
      router.push("/protected/waiting-room");
    }
    const interval = setInterval(() => {
      setCurrentTime((prev) => new Date(prev.getTime() - 100));
    }, 100);
    const nextStage = async () => {
      await delay(roundEndsAt.getTime() - now.getTime());
      router.push("/protected/match/post-match");
    };
    nextStage();
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div>
      Time Left In Stage:{" "}
      <span className="countdown">
        <span
          style={{ "--value": currentTime.getMinutes() } as React.CSSProperties}
        />
        :
        <span
          style={{ "--value": currentTime.getSeconds() } as React.CSSProperties}
        />
      </span>
    </div>
  );
};

export default SearchCountdown;
