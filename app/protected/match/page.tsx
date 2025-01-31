import MatchInfo from "@/components/ui/matchInfo";
import ProfileCard from "@/components/ui/profileCard";
import SearchCountdown from "@/components/ui/searchCountdown";
import { Label, Textarea } from "flowbite-react";

const MatchPage = () => {
  return (
    <div>
      <ProfileCard />
      <SearchCountdown roundStart={0} timerOffeset={0} />
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

export default MatchPage;
