import TrackApi from "@/actions/trackApi";
import { Track } from "../shared/track/TrackItem";

export async function RecommendationsBlock({amount}: {amount: number}) {
  const recommendations = await TrackApi.searchTracks({
    limit: amount
  });

  return (
    <div>
      <div className="font-bold text-[32px] text-mainDark mb-[10px] main:mb-[15px]">
        You may <span className="text-mainOrange">like</span>
      </div>
      <div className="grid gid-cols-1 main:grid-cols-2 w-full gap-10">
        {recommendations.data.map((item: any, index: any) => (
          <Track key={index} info={item}/>
        ))}
      </div>
    </div>
  );
}
