import type { ReactNode } from 'react';
import { getCurrentUser } from '@/actions/session';
import { searchPlaylists } from '@/actions/playlistApi';
import type { PlaylistRow } from '@/actions/types';
import { Section } from '@/components/ui/Section';
import { EmptyState } from '@/components/ui/EmptyState';
import { PlaylistTrackList } from '@/components/track/PlaylistTrackList';

const PREVIEW_SIZE = 6;

export async function DefaultPlaylistBlock({
  playlistName,
  title,
}: {
  playlistName: string;
  title: ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) return null;

  const [playlist] = await searchPlaylists({
    name: playlistName,
    isDefault: true,
    creatorId: user.id,
  }).catch((): PlaylistRow[] => []);
  const hasTracks = Boolean(playlist?.Playlist_track.some((pt) => pt.Track));

  return (
    <Section
      title={title}
      buttonLabel="Go"
      buttonHref={
        playlist && hasTracks ? `/discover/playlists/${playlist.id}` : undefined
      }
    >
      {playlist && hasTracks ? (
        <PlaylistTrackList playlist={playlist} limit={PREVIEW_SIZE} />
      ) : (
        <EmptyState>Nothing here yet!</EmptyState>
      )}
    </Section>
  );
}
