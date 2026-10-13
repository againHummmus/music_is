import { searchPlaylists } from '@/actions/playlistApi';
import { PlaylistScreen } from '@/screens/playlist/PlaylistScreen';
import { EmptyState } from '@/components/ui/EmptyState';

export default async function Page({ params }: { params: { id: string } }) {
  const results = await searchPlaylists({ id: params.id, limit: 1 });
  const playlist = results[0] ?? null;

      if (!playlist) {
        return (
          <EmptyState>Playlist not found:(</EmptyState>
        );
      }

  return <PlaylistScreen initialPlaylist={playlist} />;
}
