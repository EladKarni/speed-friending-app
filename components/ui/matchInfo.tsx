"use client";
import { useUserStore } from "@/utils/store/useUserStore";
import { useEffect } from "react";

const MatchInfo = () => {
  const matchInfo = useUserStore((state) => state.match_info);
  const getMatchInfo = useUserStore((state) => state.fetchMatchInfo);

  useEffect(() => {
    const getMatchInfoData = async () => {
      await getMatchInfo();
    };
    getMatchInfoData();
  }, []);

  if (!matchInfo) {
    return <div>Loading...</div>;
  }

  const { location } = matchInfo;
  const match_info = matchInfo.match_info as { id: string; name: string };
  return (
    <div className="flex flex-col justify-center py-2 gap-4">
      <h2 className="text-xl text-gray-700 dark:text-gray-400 -mb-2">
        Match's Info
      </h2>
      <div>
        <h5 className="mb-1 text-2xl font-medium text-gray-900 dark:text-white">
          {match_info.name}
        </h5>
        <h5 className="mb-1 xl font-medium text-gray-700 dark:text-gray-400">
          #{match_info.id}
        </h5>
      </div>
      <h5 className="mb-1 text-2xl font-medium text-gray-900 dark:text-white">
        Location: {location}
      </h5>
    </div>
  );
};

export default MatchInfo;
