import HugeiconsArrowRight02 from "~icons/hugeicons/arrow-right-02?width=24px&height=24px";
import { Track } from "./TrackItem";

export function FriendsTrackBlock() {
  const bgClasses = [
    'bg-mainOrange',
    'bg-funnyYellow',
    'bg-funnyBlue',
    'bg-funnyGrey',
    'bg-funnyBrown'
  ];

  const randomBgClass = bgClasses[Math.floor(Math.random() * bgClasses.length)];

  return (
    <div className="w-full flex flex-col items-center gap-10">
      <div 
        className={`cursor-pointer group hover:bg-opacity-80 transition-all w-full px-10 py-5 text-mainWhite rounded-[7px] flex flex-row justify-between ${randomBgClass}`}
      >
        <div>Andy</div>
        <HugeiconsArrowRight02 className="-translate-x-1 group-hover:translate-x-0 transition-all" />
      </div>
      <div className="w-full flex flex-col gap-10">
        <Track />
        <Track />
        <Track />
      </div>
    </div>
  );
}

