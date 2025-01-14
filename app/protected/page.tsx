import FetchDataSteps from "@/components/tutorial/fetch-data-steps";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import { Card } from "flowbite-react";
import { InfoIcon } from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  if (user.is_anonymous) {
    return (
      <section className="flex flex-col justify-between flex-1">
        <div>
          <Card className="max-w-sm mx-auto">
            <div className="flex flex-col justify-center items-center py-2">
              <h1 className="text-xl mb-4">Your Info</h1>
              <div className="mb-3 rounded-full shadow-lg h-24 w-24 flex justify-center items-center text-slate-800 text-4xl bg-slate-300">
                {user.user_metadata?.name?.charAt(0)}
              </div>

              <h5 className="mb-1 text-2xl font-medium text-gray-900 dark:text-white">
                {user.user_metadata?.name}
              </h5>
              <h5 className="mb-1 xl font-medium text-gray-700 dark:text-gray-400">
                #{user.user_metadata?.name?.charAt(0) + user.id.slice(0, 4)}
              </h5>
            </div>
          </Card>
          <div className="flex flex-col justify-center py-2 gap-4">
            <h2 className="text-xl text-gray-700 dark:text-gray-400 -mb-2">
              Match's Info
            </h2>
            <div>
              <h5 className="mb-1 text-2xl font-medium text-gray-900 dark:text-white">
                John Carmack
              </h5>
              <h5 className="mb-1 xl font-medium text-gray-700 dark:text-gray-400">
                #JC45f2
              </h5>
            </div>
            <h5 className="mb-1 text-2xl font-medium text-gray-900 dark:text-white">
              Location: Table J
            </h5>
          </div>
          <div className="w-full relative h-96 flex-1 bg-slate-400">
            <Image src={""} alt={"Map with your location"} fill />
          </div>
        </div>

        <div>
          <h5 className="mb-1 xl font-medium text-gray-700 dark:text-gray-400">
            Did you find your match?
          </h5>
          <div className="flex gap-4">
            <Button variant={"secondary"} className="flex-1">
              No (Ask for help)
            </Button>
            <Button className="flex-1">Yes</Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="w-full">
        <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
          <InfoIcon size="16" strokeWidth={2} />
          This is a protected page that you can only see as an authenticated
          user
        </div>
      </div>
      <div className="flex flex-col gap-2 items-start">
        <h2 className="font-bold text-2xl mb-4">Your user details</h2>
        <pre className="text-xs font-mono p-3 rounded border max-h-32 overflow-auto">
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>
      <div>
        <h2 className="font-bold text-2xl mb-4">Next steps</h2>
        <FetchDataSteps />
      </div>
    </div>
  );
}
