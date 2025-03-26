import HugeiconsArrowRight02 from "~icons/hugeicons/arrow-right-02?width=24px&height=24px";
import { PlaylistItem } from "../shared/playlist/PlaylistItem";
import { ArrowButton } from "../shared/buttons/ArrowButton";


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
        <ArrowButton title={"More"} href={"/mytracks"} color={"mainOrange"} maxWidth="100px"/>
      </div>
    </div>
  );
}
