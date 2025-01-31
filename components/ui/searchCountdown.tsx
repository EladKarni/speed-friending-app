"use client";
import { useEffect, useState } from "react";

const SearchCountdown = ({
  roundStart,
  timerOffeset,
}: {
  roundStart: number;
  timerOffeset: number;
}) => {
  const currentTimer = timerOffeset * 1000 + roundStart - Date.now();
  const [currentTime, setCurrentTime] = useState(new Date(currentTimer));

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime((prev) => new Date(prev.getTime() - 100));
    }, 100);

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
