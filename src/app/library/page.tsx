import { AddedByMeBlock } from "@/components/library/AddedByMeBlock";
import { FavouriteBlock } from "@/components/library/FavouriteBlock";
import { PlaylistsBlock } from "@/components/library/PlaylistsBlock";


export default function Home() {
  return (
    <div className="w-full flex flex-col justify-center gap-[15px] main:gap-[20px]">
      <FavouriteBlock/>
      <AddedByMeBlock/>
      <PlaylistsBlock/>
    </div>
  );
}
