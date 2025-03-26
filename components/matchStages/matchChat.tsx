import MatchInfo from "@/components/ui/matchInfo";
import { Avatar, Card, Label, Textarea } from "flowbite-react";
import { User } from "@supabase/supabase-js";

const ChattingPhase = ({ attendee }: { attendee: User }) => {
  return (
    <div>
      <Card className=" text-center">
        <Avatar rounded size="lg" img={attendee?.user_metadata.picture} />
        <span>{attendee?.user_metadata.name}</span>
        <span className="text-gray-400 text-sm font-normal font-['Inter'] leading-[21px]">
          Nerdy Patreon
        </span>
      </Card>
      <MatchInfo />
      <div className="w-full">
        <div className="mb-2 block">
          <Label htmlFor="comment" value="Your Notes" />
        </div>
        <Textarea
          id="comment"
          placeholder="Notes about the match..."
          rows={4}
        />
      </div>
    </div>
  );
};

export default ChattingPhase;
