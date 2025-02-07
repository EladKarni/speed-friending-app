import MatchList from "@/components/matchList";
import ProfileCard from "@/components/ui/profileCard";
import { getCurrentUser } from "../userActions";
import { fetchEventData } from "../actions";
import EventList from "@/components/eventList";

export default async function ProtectedPage() {
  const user = await getCurrentUser();

  if (!user) {
    return <div>loading...</div>;
  }

  const activeEvent = await fetchEventData(user.user_metadata.event_id);

  if (!activeEvent) {
    return <div>loading...</div>;
  }
  return (
    <div className="w-full flex flex-col gap-8">
      <ProfileCard />
      {!activeEvent ? (
        <div>loading...</div>
      ) : (
        <EventList events={[activeEvent]} />
      )}
      <MatchList />
    </div>
  );
}
