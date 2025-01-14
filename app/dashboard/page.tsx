import { createClient } from "@/utils/supabase/server";
import { Avatar, Card } from "flowbite-react";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

const Dashboard = async () => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

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
        <span>
          No Previous Events
          <br />
          Please join an event and come back to view the results after it
        </span>
      </div>
      <Link
        href="/protected/new-event"
        className="w-fit rounded-full absolute bottom-0 right-0 m-4 bg-slate-700 p-4 hover:bg-transparent cursor-pointer"
      >
        <PlusIcon className="pointer-events-none hover:text-slate-900" />
      </Link>
    </div>
  );
};

export default Dashboard