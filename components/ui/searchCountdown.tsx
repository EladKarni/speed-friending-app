"use client";
import { delay } from "@/utils/utils";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const SearchCountdown = ({
    secondsRemaining,
}: {
    secondsRemaining: number;
}) => {
    const [currentTime, setCurrentTime] = useState(
        new Date(secondsRemaining * 1000)
    );

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
    }, []);

    if (currentTime.getTime() === 0) {
      return (
        <div className="text-center text-4xl">
          <h1>Time's up!</h1>
        </div>
      );
    }

    return (
      <div className="flex flex-col justify-center items-center">
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
