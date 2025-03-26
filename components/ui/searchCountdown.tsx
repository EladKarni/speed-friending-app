"use client";
import { useEffect, useState } from "react";

const SearchCountdown = ({
  secondsRemaining,
  currentPhase,
}: {
  secondsRemaining: number;
  currentPhase: 0 | 1 | 2 | 3 | 4; // Assuming these are the phases you want to track
}) => {
  const [currentTime, setCurrentTime] = useState(new Date(0)); // Initialize with 0 to avoid NaN issues

  useEffect(() => {
    setCurrentTime(new Date(secondsRemaining * 1000));
    console.log(secondsRemaining, currentPhase);
  }, [currentPhase]);

  useEffect(() => {
    if (currentTime.getTime() === 0) {
      return;
    }
    const interval = setInterval(() => {
      if (currentTime.getTime() !== 0) {
        setCurrentTime((prev) => {
          if (prev.getTime() <= 0) {
            clearInterval(interval);
            return new Date(0);
          }
          return new Date(prev.getTime() - 100);
        });
      }
    }, 100);
    return () => {
      clearInterval(interval);
    };
  }, [currentTime]);

  if (currentTime.getTime() === 0) {
    if (currentPhase === 0) {
      return (
        <div className="text-center text-4xl h-28 flex justify-center items-center">
          <h1>Round Is Starting...</h1>
        </div>
      );
    }
    if (currentPhase < 4) {
      return (
        <div className="text-center text-4xl h-28 flex justify-center items-center">
          <h1 className="text-2xl">Moving To Next Phase...</h1>
        </div>
      );
    }
    if (currentPhase === 4) {
      return (
        <div className="text-center text-4xl h-28 flex justify-center items-center">
          <h1>Round is Over!</h1>
        </div>
      );
    }
  }

  return (
    <div className="flex flex-col justify-center items-center h-28">
      <h1 className="text-2xl">Time Left </h1>
      <div className="grid grid-flow-col gap-5 text-center auto-cols-max">
        <div className="flex flex-col">
          <span className="countdown font-mono text-5xl">
            <span
              style={
                { "--value": currentTime.getMinutes() } as React.CSSProperties
              }
              aria-live="polite"
            >
              {currentTime.getMinutes()}
            </span>
          </span>
          min
        </div>
        <div className="flex flex-col">
          <span className="countdown font-mono text-5xl">
            <span
              style={
                { "--value": currentTime.getSeconds() } as React.CSSProperties
              }
              aria-live="polite"
            >
              {currentTime.getSeconds()}
            </span>
          </span>
          sec
        </div>
      </div>
    </div>
  );
};

export default SearchCountdown;
