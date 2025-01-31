import ConfirmPrompt from "@/components/ui/confirmPrompt";
import MatchInfo from "@/components/ui/matchInfo";
import { Label, Textarea } from "flowbite-react";
import Link from "next/link";

const PostMatchPage = () => {
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
