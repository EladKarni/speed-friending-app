import MatchSearch from "@/components/matchStages/matchSearch";
import { createClient } from "@/utils/supabase/server";
import { Button } from "flowbite-react";
import Link from "next/link";
import { redirect } from "next/navigation";

const MatchSearchPage = async () => {
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
        return redirect("/protected/match");
    }

    const { data: round_info } = await supabase
        .from("event_rounds")
        .select("*")
        .eq("event_id", data.id)
        .order("round_started_at", { ascending: false })
        .limit(1)
        .single();

    if (!round_info) {
        console.log("No Info");
        return redirect("/protected/waiting-room");
    }

    if (round_info.round_ended_at) {
        console.log('round already ended', round_info.id);
        redirect("/protected/waiting-room");
    }

    return (
        <section className="flex flex-col justify-between flex-1">
            <MatchSearch event_data={data} />
            <div>
                <h5 className="mb-1 xl font-medium text-gray-700 dark:text-gray-400">
                    Did you find your match?
                </h5>
                <div className="flex justify-between gap-4">
                    <Button className="mt-4 flex-1" color="gray" disabled>
                        Not Found
                    </Button>
                    <Link href={"/protected/match/match-chat"} className="mt-4 flex-1">
                        <Button color="blue" className="w-full">
                            Found
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default MatchSearchPage;
