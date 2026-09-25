'use client';
import { PlaylistItem } from '../shared/playlist/PlaylistItem';
import { useAuthStore } from '@/stores/authStore';
import { searchUserPlaylists } from '@/actions/userPlaylistApi';
import { ContentBlock } from '../shared/ContentBlock';

export function PlaylistsBlock() {
  const currentUser = useAuthStore((state) => state.user);

  if (!currentUser) return null;

  return (
    <ContentBlock
      title={<span className="text-mainDark">Your playlists:</span>}
      fetchItems={async () => {
        const res = await searchUserPlaylists({
          userId: currentUser.id,
          limit: 6,
        });
        return ((res as any).data ?? []).filter((item: any) => item.Playlist);
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
