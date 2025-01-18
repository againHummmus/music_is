import { User } from "../shared/user/UserItem";

export function RecommendedUsersBlock() {
    return (
      <div className="w-full flex flex-col min-w-0 p-15 rounded-[12px] border-2 border-mainOrange bg-gradient-to-b from-white to-white/0">
        <div className="font-bold text-[32px] text-mainDark mb-[10px] main:mb-[15px]">
          You have much <span className="text-mainOrange">in common:</span>
        </div>
        <div className="relative w-full ">
          <div className="absolute z-[1000] top-0 left-0 w-[10px] h-full bg-gradient-to-r from-white to-transparent pointer-events-none max-main:block hidden"></div>
          <div className="absolute z-[1000] top-0 right-0 w-[10px] h-full bg-gradient-to-l from-white to-transparent pointer-events-none max-main:block hidden"></div>
          <div className="flex flex-row gap-10 overflow-x-scroll custom-scrollbar-x scrollbar-container-x ">
            <User />
            <User />
            <User />
            <User />
          </div>
        </div>
      </div>
    );
  }