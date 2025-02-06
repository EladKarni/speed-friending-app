import EventList from "@/components/eventList";
import MatchList from "@/components/matchList";
import ProfileCard from "@/components/ui/profileCard";
import { createClient } from "@/utils/supabase/server";
import { Card } from "flowbite-react";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const { data: events, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", user.user_metadata?.event_id);

  if (error) {
    console.log({ error });
    return <div>Error: No event found</div>;
  }

  return (
    <div className="w-full flex flex-col gap-8">
      <ProfileCard />
      {/* <EventList events={events} /> */}
      <MatchList />
    </div>
  );
}
