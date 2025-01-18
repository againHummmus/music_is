import HugeiconsArrowRight02 from "~icons/hugeicons/arrow-right-02?width=24px&height=24px";
import { PlaylistItem } from "../shared/playlist/PlaylistItem";


export function PlaylistsBlock() {
  return (
    <div>
      <div className="font-bold text-[24px] text-mainDark mb-[10px] main:mb-[15px]">
        Your playlists:
      </div>
      <div className="grid grid-cols-1 main:grid-cols-2 gap-10 mb-[10px] main:mb-[15px]">
        <PlaylistItem />
        <PlaylistItem />
        <PlaylistItem />
        <PlaylistItem />
        <PlaylistItem />
        <PlaylistItem />
      </div>
      <div className="w-full flex flex-row justify-end">
        <div
          className={`cursor-pointer group hover:bg-opacity-80 transition-all w-full  max-w-[100px] px-10 py-5 text-mainWhite rounded-[7px] flex flex-row justify-between bg-mainOrange`}
        >
          <div>More</div>
          <HugeiconsArrowRight02 className="-translate-x-1 group-hover:translate-x-0 transition-all" />
        </div>
      </div>
    </div>
  );
}
