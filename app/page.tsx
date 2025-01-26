import UserEntryPoint from "@/components/UserEntryPoint";
import { createClient } from "@/utils/supabase/server";
import { Card } from "flowbite-react";

export default async function Index() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <>
      <main className="flex-1 flex flex-col gap-6 px-4 justify-center">
        <UserEntryPoint />
        {/* <Card className="max-w-sm">
          <div className="flex flex-col justify-center items-center py-2">
            <div className="mb-3 rounded-full shadow-lg h-24 w-24 flex justify-center items-center text-slate-800 text-4xl bg-slate-300">
              E
            </div>

            <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
              Bonnie Green
            </h5>
            <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
              Bonnie Green
            </h5>
          </div>
        </Card> */}
      </main>
    </>
  );
}
