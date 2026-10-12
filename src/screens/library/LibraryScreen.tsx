import { RecommendedUsersBlock } from '@/components/user/RecommendedUsersBlock';
import { FavouriteBlock } from './FavouriteBlock';
import { MyPlaylistsBlock } from './MyPlaylistsBlock';
import { Charts } from './Charts';
import { FriendsPlaylistsBlock } from './FriendsPlaylistsBlock';
import { RecommendationsBlock } from './RecommendationsBlock';

export function LibraryScreen() {
  return (
    <div className="flex w-full flex-col justify-center gap-[15px] main:gap-[20px]">
      <FavouriteBlock />
      <MyPlaylistsBlock />
      <Charts />
      <RecommendationsBlock />
      <RecommendedUsersBlock />
      <FriendsPlaylistsBlock />
    </div>
  );
}
