import { Track } from "../shared/track/TrackItem";

export function RecommendationsBlock({amount}: {amount: number}) {
  return (
    <div>
      <div className="font-bold text-[32px] text-mainDark mb-[10px] main:mb-[15px]">
        You may <span className="text-mainOrange">like</span>
      </div>
      <div className="grid gid-cols-1 main:grid-cols-2 w-full gap-10">
        {Array.from({ length: amount }).map((_, index) => (
          <Track key={index} />
        ))}
      </div>
    </div>
  );
}
