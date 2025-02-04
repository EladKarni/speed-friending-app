import MatchInfo from "@/components/ui/matchInfo";
import ProfileCard from "@/components/ui/profileCard";
import SearchCountdown from "@/components/ui/searchCountdown";
import { createClient } from "@/utils/supabase/server";
import { Label, Textarea } from "flowbite-react";
import { redirect } from "next/navigation";

const MatchPage = async () => {
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

  if (!round_info || !round_info.round_started_at) {
    console.log("No Info");
    return redirect("/protected/waiting-room");
  }

  return (
    <div>
      <ProfileCard />
      <SearchCountdown
        roundStart={round_info.round_started_at}
        chatTimer={round_info.round_timers}
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
