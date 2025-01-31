import React from "react";
import { Card } from "flowbite-react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const ProfileCard = async ({ children }: { children?: React.ReactElement }) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/");
  }
  return (
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
          #{user.id.slice(0, 4)}
        </h5>
      </div>
      {children}
    </Card>
  );
};

export default ProfileCard;
