import { FriendsTrackBlock } from "@components/shared/FriendTracksItem";
import { PlaylistItem } from "@components/shared/PlaylistItem";

export async function FriendsPlaylistsBlock() {
  return (
    <div>
      <div className="flex flex-col main:flex-row justify-between main:h-[150px] max-main:bg-[url('/images/friendsBannerBackground.png')] max-main:rounded-[7px] max-main:p-20 main:min-h-[170px] gap-[10px] mb-[10px] main:mb-[15px]">
        <div className="w-[55%] hidden main:block bg-[url('/images/friendsBannerBackground.png')] bg-center rounded-[7px] bg-cover bg-no-repeat h-full" />
        <div className="main:w-[45%] h-full flex flex-col max-main:flex-row justify-between items-end gap-[10px]">
          <div className="w-full text-lg main:text-4xl text-mainBlack max-main:text-mainWhite font-semibold">
            Your friends' <br /> playlists
          </div>
          <button className="w-full font-bold h-[30px] main:h-[50px] rounded-[7px] border-2 border-mainOrange hover:bg-mainOrange hover:text-mainDark transition-all flex items-center justify-center text-mainOrange">
            See more
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 main:grid-cols-2 gap-10">
        <PlaylistItem />
        <PlaylistItem />
        <PlaylistItem />
        <PlaylistItem />
        <PlaylistItem />
        <PlaylistItem />
      </div>
    </div>
  );
}
