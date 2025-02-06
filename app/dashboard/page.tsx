import EventList from "@/components/eventList";
import { createClient } from "@/utils/supabase/server";
import { Avatar, Card } from "flowbite-react";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

const Dashboard = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: events, error } = await supabase
    .from("events")
    .select("*")
    .eq("organizer", user?.id || "");

  if (error) {
    console.log({ error });
    return <div>Error: No event found</div>;
  }

  return (
    <div className="w-full flex flex-col gap-8">
      <Card className=" text-center">
        <Avatar rounded size="lg" img={user?.user_metadata.picture} />
        <span>{user?.user_metadata.name}</span>
        <span className="text-gray-400 text-sm font-normal font-['Inter'] leading-[21px]">
          Nerdy Patreon
        </span>
      </Card>
      <EventList events={events} />
      <Link
        href="/dashboard/event/new-event"
        className="w-fit rounded-full absolute bottom-0 right-0 m-4 bg-slate-700 p-4 hover:bg-transparent cursor-pointer"
      >
        <PlusIcon className="pointer-events-none hover:text-slate-900" />
      </Link>
    </div>
  );
};

export default Dashboard;
