import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const MatchInfo = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    console.log("No user found");
    return redirect("/");
  }

  const { data: attendee_match } = await supabase
    .from("event_round_matches")
    .select("*")
    .eq("attendee_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (!attendee_match) {
    console.log("No match found");
    return redirect("/");
  }
  const { location } = attendee_match;
  const match_info = attendee_match.match_info as { id: string; name: string };
  return (
    <div className="flex flex-col justify-center py-2 gap-4">
      <h2 className="text-xl text-gray-700 dark:text-gray-400 -mb-2">
        Match's Info
      </h2>
      <div>
        <h5 className="mb-1 text-2xl font-medium text-gray-900 dark:text-white">
          {match_info.name}
        </h5>
        <h5 className="mb-1 xl font-medium text-gray-700 dark:text-gray-400">
          #{match_info.id}
        </h5>
      </div>
      <h5 className="mb-1 text-2xl font-medium text-gray-900 dark:text-white">
        Location: {location}
      </h5>
    </div>
  );
};

export default MatchInfo;
