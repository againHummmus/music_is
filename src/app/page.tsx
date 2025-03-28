import { FriendsPlaylistsBlock } from "@/components/mainScreen/FriendsPlaylistsBlock";
import { FriendsBlock } from "@/components/mainScreen/FriendsTracksBlock";
import { RecommendationsBlock } from "@/components/mainScreen/RecommendationsBlock";
import { RecommendedUsersBlock } from "@/components/mainScreen/RecommendedUsersBlock";

export const dynamic = 'force-dynamic'

export default function Home() {
  return (
    <>
        <div className="w-full flex flex-col justify-center gap-[15px] main:gap-[50px]">
          <RecommendationsBlock amount={6} />
          <FriendsBlock />
          <RecommendedUsersBlock />
          <FriendsPlaylistsBlock />
        </div>
    </>
  );
}