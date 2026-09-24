'use client';
import { PlaylistItem } from '../shared/playlist/PlaylistItem';
import { useStore } from '@/app/store';
import { searchUserPlaylists } from '@/actions/userPlaylistApi';
import { ContentBlock } from '../shared/ContentBlock';

export function PlaylistsBlock() {
  const currentUser = useStore((state) => state.user);

  if (!currentUser) return null;

  return (
    <ContentBlock
      title={<span className="text-mainDark">Your playlists:</span>}
      fetchItems={async () => {
        const res = await searchUserPlaylists({
          userId: currentUser.id,
          limit: 6,
        });
        return (res as any).data;
      }}
      renderItem={(item, index) => (
        <PlaylistItem key={index} info={item.Playlist} />
      )}
      buttonLabel="Go"
      buttonHref="/discover/playlists"
      emptyLabel="Nothing here yet!"
    />
  );
}
