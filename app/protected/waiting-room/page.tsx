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

  console.log(event);
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
        <h2>You are waiting for {event?.event_name} to start</h2>
      </div>
    </div>
  );
};

export default WaitingRoom;
