import { Charts } from "@/components/mainScreen/Charts";
import { FriendsPlaylistsBlock } from "@/components/mainScreen/FriendsPlaylistsBlock";
import { RecommendationsBlock } from "@/components/mainScreen/RecommendationsBlock";
import { RecommendedUsersBlock } from "@/components/mainScreen/RecommendedUsersBlock";

export const dynamic = 'force-dynamic'

export default function Home() {
  return (
    <>
        <div className="w-full flex flex-col justify-center gap-[15px] main:gap-[50px]">
          <Charts/>
          <RecommendationsBlock/>
          {/* <FriendsBlock /> */}
          <RecommendedUsersBlock />
          <FriendsPlaylistsBlock />
        </div>
    </>
  );
}