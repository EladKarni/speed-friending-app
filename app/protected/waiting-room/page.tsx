"use client";

import { fetchEventData, modifyAttendeeReadyForNextRound } from "@/app/actions";
import ConfirmPrompt from "@/components/ui/confirmPrompt";
import { useUserStore } from "@/utils/store/useUserStore";
import { EventType } from "@/utils/supabase/schema";
import { Card, Avatar } from "flowbite-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { subscribeAlert } from "@/utils/supabase/alerts";

const WaitingRoom = () => {
    const attendee = useUserStore((state) => state.user_data);
    const isReady = useUserStore((state) => state.isReady);
    const getUserStore = useUserStore((state) => state.fetchUserData);
    const getReadyStatus = useUserStore((state) => state.fetchReadyStatus);
    const updateReadyStatus = useUserStore((state) => state.updateReadyStatus);

    const [event, setEvent] = useState<EventType>();
    const router = useRouter();

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
            await getReadyStatus(attendee.id);
            const event = await fetchEventData(attendee!.user_metadata.event_id);
            console.log(event);
            if (event) {
                setEvent(event);
            }
        };
        setup();
    }, [attendee]);

    if (!attendee || !event) {
        return <div>Loading...</div>;
    }

    // Subscribe to changes in the round_participation & event_round_matches tables

    subscribeAlert((alert) => {
        if (alert.alert_type === 'StartRound') {
            router.push(`/protected/match`);
        }
    })


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

export default WaitingRoom;
