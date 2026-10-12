'use client';
import { PlaylistItem } from '@/components/playlist/PlaylistItem';
import { useAuthStore } from '@/stores/authStore';
import { searchUserPlaylists } from '@/actions/userPlaylistApi';
import { ContentBlock } from '@/components/ui/ContentBlock';

export function MyPlaylistsBlock() {
  const currentUser = useAuthStore((state) => state.user);

  if (!currentUser) return null;

  return (
    <ContentBlock
      title={<span className="text-mainDark">Your playlists:</span>}
      fetchItems={async () => {
        const connections = await searchUserPlaylists({
          userId: currentUser.id,
          limit: 6,
        });
        return connections.flatMap((conn) =>
          conn.Playlist ? [conn.Playlist] : []
        );
      }}
      renderItem={(playlist, index) => (
        <PlaylistItem key={index} info={playlist} />
      )}
      buttonLabel="Go"
      buttonHref="/discover/playlists"
      emptyLabel="Nothing here yet!"
    />
  );
}
