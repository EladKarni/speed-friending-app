import MatchInfo from "@/components/ui/matchInfo";
import ProfileCard from "@/components/ui/profileCard";
import SearchCountdown from "@/components/ui/searchCountdown";
import { createClient } from "@/utils/supabase/server";
import { Label, Textarea } from "flowbite-react";
import { redirect } from "next/navigation";
import { getMostRecentAlert, subscribeAlert } from "@/utils/supabase/alerts";

const MatchPage = async () => {
    console.log("In the match page");
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/protected/match");
    }

    const { data } = await supabase
        .from("events")
        .select("*")
        .eq("id", user.user_metadata.event_id)
        .single();

    if (!data) {
        console.log("No event data");
        return redirect("/protected/match");
    }

    await subscribeAlert((alert) => {
        switch (alert.alert_type) {
            case 'PostMatchPhase':
            case 'RoundEnded':
            case 'EventEnded':
                redirect('/protected/match/post-match');
                break;
        }
    });

    const { data: round_info } = await supabase
        .from("event_rounds")
        .select("*")
        .eq("event_id", data.id)
        .order("round_started_at", { ascending: false })
        .limit(1)
        .single();

    if (!round_info || !round_info.round_started_at) {
        console.log("No Info");
        return redirect("/protected/waiting-room");
    }



    const alert = await getMostRecentAlert(round_info.event_id, round_info.id);
    const alertType = alert?.alert_type ?? "StartRound";
    if (round_info.round_ended_at || alertType === "PostMatchPhase" || alertType === "RoundEnded") {
        console.log("round already ended");
        return redirect("/protected/match/post-match")
    }

    let countDown = round_info.round_timers[3];
    switch (alertType) {
        case "StartRound":
            countDown = round_info.round_timers[0];
            break;
        case "LocatingPhase":
            countDown = round_info.round_timers[1];
            break;
        case "ChattingPhase":
            countDown = round_info.round_timers[2];
            break;
    }




    return (
        <div>
            <ProfileCard />
            <SearchCountdown
                secondsRemaining={countDown}
            />
            <MatchInfo />
            <div className="w-full">
                <div className="mb-2 block">
                    <Label htmlFor="comment" value="Your Notes" />
                </div>
                <Textarea
                    id="comment"
                    placeholder="Notes about the match..."
                    rows={4}
                />
            </div>
        </div>
    );
};

export default MatchPage;
