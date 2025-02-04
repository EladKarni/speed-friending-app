import {
  modifyAttendeeReadyForNextRound,
  setWillShareContactInfo,
} from "@/app/actions";
import ConfirmPrompt from "@/components/ui/confirmPrompt";
import MatchInfo from "@/components/ui/matchInfo";
import { createClient } from "@/utils/supabase/server";
import { Label, Textarea } from "flowbite-react";
import Link from "next/link";
import { redirect } from "next/navigation";

const PostMatchPage = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    console.log("No user found");
    return redirect("/");
  }

  const { data: attendee_match } = await supabase
    .from("event_round_matches")
    .select("*")
    .eq("attendee_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (!attendee_match) {
    console.log("No match found");
    return redirect("/");
  }

  const handleShareButton = async () => {
    "use server";
    console.log("Sharing contact info");
    await setWillShareContactInfo(true, attendee_match.id);
    await modifyAttendeeReadyForNextRound(false);
    redirect("/protected/waiting-room");
  };

  const handleCancel = async () => {
    "use server";
    await modifyAttendeeReadyForNextRound(false);
    redirect("/protected/waiting-room");
  };

  return (
    <div className="flex-1 flex flex-col justify-between">
      <div
        className="radial-progress text-slate-500"
        style={{ "--value": 60 } as React.CSSProperties}
        role="progressbar"
      >
        70s
      </div>
      <MatchInfo />
      <div className="w-full">
        <div className="mb-2 block">
          <Label htmlFor="comment" value="Your Notes" />
        </div>
        <Textarea
          id="comment"
          placeholder="Notes about the match..."
          className="h-96"
          rows={4}
        />
      </div>
      <div>
        <h2>Do you want to share your info?</h2>
        <ConfirmPrompt
          handleConfirm={handleShareButton}
          handleCancel={handleCancel}
          ConfirmBtnType={"button"}
          cancleText={"Don't Share"}
          confirmText={"Share"}
        />
      </div>
      <Link href={"/protected/waiting-room"}>Next</Link>
    </div>
  );
};

export default PostMatchPage;
