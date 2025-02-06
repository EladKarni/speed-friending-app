import { createClient } from "@/utils/supabase/server";
import { Card } from "flowbite-react";
import { redirect } from "next/navigation";
import React from "react";

const MatchList = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/");
  }

  const { data: my_matches, error } = await supabase
    .from("event_round_matches")
    .select("*")
    .eq("attendee_id", user.id);

  const { data: other_matches } = await supabase
    .from("event_round_matches")
    .select("*")
    .eq("match_info->>id", user.id);

  if (error || other_matches === null) {
    console.error({ error });
    return <div>Error: No matches found</div>;
  }
  // compare both arrays of matches and return the matches where both users have willShare as true
  const matches = my_matches.filter((match) => {
    const match_info = match.match_info as { id: string; name: string };
    return other_matches.some(
      (other_match) =>
        match_info.id === other_match.attendee_id &&
        match.willShare &&
        other_match.willShare
    );
  });

  console.log({ matches }, { my_matches }, { other_matches });
  return (
    <div>
      <h1>Your matches</h1>
      {matches.map(({ match_info }) => (
        <Card key={match_info.id}>
          <div className="w-full flex justify-between">
            <h2 className="text-2xl">{match_info.name}</h2>
            <p className="italic text-slate-300">#F254</p>
          </div>
          <div>
            <h3 className="text-slate-300">Time Preference</h3>
            <p>Anytime</p>
          </div>
          <div>
            <h3 className="text-slate-300">Contact Info</h3>
            <p>{`(412) 555-5555`}</p>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default MatchList;
