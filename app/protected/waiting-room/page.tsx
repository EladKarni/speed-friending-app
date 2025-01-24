import { createClient } from "@/utils/supabase/server";
import { Card, Avatar } from "flowbite-react";

const WaitingRoom = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return null;
  }
  const { data: event, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", user.user_metadata.event_id)
    .single();

  return (
    <div className="w-full flex flex-col gap-8">
      <Card className=" text-center">
        <Avatar rounded size="lg" img={user?.user_metadata.picture} />
        <span>{user?.user_metadata.name}</span>
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
        <img
          src={`https://ysowurspnajoufhabtjt.supabase.co/storage/v1/object/public/${event?.event_map}`}
          alt="map of current event"
        />
      </div>
    </div>
  );
};

export default WaitingRoom;
