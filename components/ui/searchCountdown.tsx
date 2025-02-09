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

    const router = useRouter();

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
