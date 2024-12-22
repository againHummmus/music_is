import MingcuteHome5Fill from "~icons/mingcute/home-5-fill?width=24px&height=24px";
import HugeiconsUserGroup from "~icons/hugeicons/user-group?width=24px&height=24px";
import HugeiconsMessage01 from "~icons/hugeicons/message-01?width=24px&height=24px";
import HugeiconsFolderLibrary from "~icons/hugeicons/folder-library?width=24px&height=24px";
import HugeiconsUploadCircle01 from "~icons/hugeicons/upload-circle-01?width=24px&height=24px";

export async function MobileNav() {
  return (
    <div className="max-w-[100%] fixed z-[1000] bottom-[5px] left-[5px] right-[5px] py-10 px-[15%] flex-row text-mainWhite bg-mainDark rounded-[9px] justify-between items-center max-main:flex hidden">
      <button className="flex flex-col items-center gap-5 text-mainOrange">
        <MingcuteHome5Fill />
      </button>

      <button className="flex flex-col items-center gap-5 hover:text-mainOrange transition-colors">
        <HugeiconsFolderLibrary />
      </button>

      <button className="flex flex-col items-center gap-5 hover:text-mainOrange transition-colors">
        <HugeiconsUploadCircle01 />
      </button>

      <button className="flex flex-col items-center gap-5 hover:text-mainOrange transition-colors">
        <HugeiconsUserGroup />
      </button>

      <button className="flex flex-col items-center gap-5 hover:text-mainOrange transition-colors">
        <HugeiconsMessage01 />
      </button>
    </div>
  );
}
