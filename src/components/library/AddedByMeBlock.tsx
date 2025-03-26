import HugeiconsArrowRight02 from "~icons/hugeicons/arrow-right-02?width=24px&height=24px";
import { Track } from "../shared/track/TrackItem";
import { ArrowButton } from "../shared/buttons/ArrowButton";

export function AddedByMeBlock() {
  return (
    <div>
      <div className="font-bold text-[24px] text-mainDark mb-[10px] main:mb-[15px]">
        Added by you:
      </div>
      <div className="grid gid-cols-1 main:grid-cols-2 w-full gap-10 mb-[10px] main:mb-[15px]">
        <Track />
        <Track />
        <Track />
        <Track />
        <Track />
        <Track />
      </div>
      <div className="w-full flex flex-row justify-end">
        <ArrowButton title={"More"} href={"/mytracks"} color={"mainOrange"} maxWidth="100px"/>
      </div>
    </div>
  );
}
