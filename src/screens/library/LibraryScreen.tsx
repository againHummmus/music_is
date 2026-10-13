import { Suspense } from 'react';
import { SectionSkeleton } from '@/components/ui/SectionSkeleton';
import { RecommendedUsersBlock } from '@/components/user/RecommendedUsersBlock';
import { TrackCollectionBlock } from './TrackCollectionBlock';
import { TRACK_COLLECTIONS } from './trackCollections';
import { MY_PLAYLISTS_TITLE, MyPlaylistsBlock, PLAYLIST_SKELETON_CLASS } from './MyPlaylistsBlock';
import { FriendsPlaylistsBlock } from './FriendsPlaylistsBlock';

export function LibraryScreen() {
  const [favourite, charts, friendsLike] = [
    TRACK_COLLECTIONS.liked,
    TRACK_COLLECTIONS.charts,
    TRACK_COLLECTIONS.friendsLike,
  ].map((collection) => (
    <Suspense key={collection.slug} fallback={<SectionSkeleton title={collection.title} />}>
      <TrackCollectionBlock collection={collection} />
    </Suspense>
  ));

  return (
    <div className="flex w-full flex-col justify-center gap-[15px] main:gap-[20px]">
      {favourite}
      <Suspense
        fallback={
          <SectionSkeleton title={MY_PLAYLISTS_TITLE} itemClassName={PLAYLIST_SKELETON_CLASS} />
        }>
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
