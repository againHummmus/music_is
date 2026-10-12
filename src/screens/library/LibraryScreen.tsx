import { Suspense } from 'react';
import { SectionSkeleton } from '@/components/ui/SectionSkeleton';
import { RecommendedUsersBlock } from '@/components/user/RecommendedUsersBlock';
import { DefaultPlaylistBlock } from './DefaultPlaylistBlock';
import {
  MY_PLAYLISTS_TITLE,
  MyPlaylistsBlock,
  PLAYLIST_SKELETON_CLASS,
} from './MyPlaylistsBlock';
import { FriendsPlaylistsBlock } from './FriendsPlaylistsBlock';

const defaultPlaylistBlocks = [
  {
    playlistName: 'Favourite',
    title: <span className="text-mainOrange">Your favourite:</span>,
  },
  { playlistName: 'Recommendations', title: 'CHARTS:' },
  { playlistName: 'Your friends like this', title: 'Your friends like:' },
];

export function LibraryScreen() {
  const [favourite, charts, friendsLike] = defaultPlaylistBlocks.map(
    ({ playlistName, title }) => (
      <Suspense key={playlistName} fallback={<SectionSkeleton title={title} />}>
        <DefaultPlaylistBlock playlistName={playlistName} title={title} />
      </Suspense>
    )
  );

  return (
    <div className="flex w-full flex-col justify-center gap-[15px] main:gap-[20px]">
      {favourite}
      <Suspense
        fallback={
          <SectionSkeleton
            title={MY_PLAYLISTS_TITLE}
            itemClassName={PLAYLIST_SKELETON_CLASS}
          />
        }
      >
        <MyPlaylistsBlock />
      </Suspense>
      {charts}
      {friendsLike}
      <Suspense fallback={null}>
        <RecommendedUsersBlock />
      </Suspense>
      <Suspense fallback={null}>
        <FriendsPlaylistsBlock />
      </Suspense>
    </div>
  );
}
