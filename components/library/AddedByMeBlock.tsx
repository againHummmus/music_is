import { Track } from "@components/shared/TrackItem";
import HugeiconsArrowRight02 from "~icons/hugeicons/arrow-right-02?width=24px&height=24px";

export async function AddedByMeBlock() {
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
