import { User } from "@components/shared/UserItem";

export async function RecommendedUsersBlock() {
  return (
    <div className="max-w-full flex flex-col p-15 rounded-[12px] border-2 border-mainOrange bg-gradient-to-b from-white to-white/0">
      <div className="font-bold text-[32px] text-mainDark mb-[10px] tablet:mb-[15px]">
        You have much <span className="text-mainOrange">in common:</span>
      </div>
      <div className="relative">
        <div className="absolute z-[1000] top-0 left-0 w-[10px] h-full bg-gradient-to-r from-white to-transparent pointer-events-none max-tablet:block hidden flex-shrink-0"></div>
        <div className="absolute z-[1000] top-0 right-0 w-[10px] h-full bg-gradient-to-l from-white to-transparent pointer-events-none max-tablet:block hidden flex-shrink-0"></div>
        <div className="flex flex-row overflow-x-scroll custom-scrollbar-x scrollbar-container-x gap-10">
          <User />
          <User />
          <User />
          <User />
        </div>
      </div>
    </div>
  );
}
