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
  }

  const sortedEvents = events?.sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
  return (
    <div className="w-full flex flex-col gap-8">
      <Card className=" text-center">
        <Avatar rounded size="lg" img={user?.user_metadata.picture} />
        <span>{user?.user_metadata.name}</span>
        <span className="text-gray-400 text-sm font-normal font-['Inter'] leading-[21px]">
          Nerdy Patreon
        </span>
      </Card>
      <div className="mx-8 text-center text-gray-400 text-lg">
        {sortedEvents && sortedEvents?.length > 0 ? (
          <>
            <h2 className="text-2xl mb-4">Your Events</h2>
            <div className="flex flex-col gap-4">
              {sortedEvents?.map((event) => {
                return (
                  <Link
                    href={`/dashboard/event?event_id=${event.id}`}
                    key={event.id}
                  >
                    <Card
                      key={event.id}
                      className="flex justify-between items-center"
                    >
                      <div className="text-slate-200">{event.event_name}</div>
                      <div>
                        Created on{" "}
                        <span className="italic text-slate-200">
                          {new Date(event.created_at).toDateString()}
                        </span>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </>
        ) : (
          <span>
            No Previous Events
            <br />
            Please join an event and come back to view the results after it
          </span>
        )}
      </div>
      <Link
        href="/dashboard/event/new-event"
        className="w-fit rounded-full absolute bottom-0 right-0 m-4 bg-slate-700 p-4 hover:bg-transparent cursor-pointer"
      >
        <PlusIcon className="pointer-events-none hover:text-slate-900" />
      </Link>
    </div>
  );
};

export default Dashboard