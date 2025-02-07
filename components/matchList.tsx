import { createClient } from "@/utils/supabase/server";
import { Card } from "flowbite-react";
import { redirect } from "next/navigation";

const MatchList = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data, error } = await supabase.rpc("get_distinct_attendee_info", {
    my_uuid: user.id,
  });

  if (error) {
    console.error("Error fetching attendee info:", error);
  } else {
    console.log("Distinct Attendee Info:", data);
  }

  if (!data || data.length === 0) {
    return (
      <h1 className="text-center text-3xl mb-8">No matches at this time</h1>
    );
  }

  return (
    <div>
      <h1 className="text-center text-3xl mb-8">Your matches</h1>
      <div className="flex flex-col gap-4">
        {data.map(({ id, name, email }) => (
          <Card key={id}>
            <div className="w-full flex justify-between">
              <h2 className="text-2xl">{name}</h2>
              <p className="italic text-slate-300">
                #{id.slice(id.length - 4, id.length).toUpperCase()}
              </p>
            </div>
            <div>
              <h3 className="text-slate-300">Time Preference</h3>
              <p>Anytime</p>
            </div>
            <div>
              <h3 className="text-slate-300">Contact Info</h3>
              <a href={`mailto:${email}`} className="text-blue-300">
                {email}
              </a>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MatchList;
