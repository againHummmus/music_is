import { getCurrentUser } from '@/actions/session';
import { searchUserPlaylists } from '@/actions/userPlaylistApi';
import type { UserPlaylistRow } from '@/actions/types';
import { PlaylistItem } from '@/components/playlist/PlaylistItem';
import { Section } from '@/components/ui/Section';
import { EmptyState } from '@/components/ui/EmptyState';
import { TRACK_GRID_CLASS } from '@/components/ui/SectionSkeleton';

export const MY_PLAYLISTS_TITLE = (
  <span className="text-mainDark">Your playlists:</span>
);
export const PLAYLIST_SKELETON_CLASS =
  'h-[70px] main:h-[90px] animate-pulse rounded-[7px] bg-gray-300';

export async function MyPlaylistsBlock() {
  const user = await getCurrentUser();
  if (!user) return null;

  const connections = await searchUserPlaylists({
    userId: user.id,
    limit: 6,
  }).catch((): UserPlaylistRow[] => []);
  const playlists = connections.flatMap((conn) =>
    conn.Playlist ? [conn.Playlist] : []
  );

  return (
    <Section
      title={MY_PLAYLISTS_TITLE}
      buttonLabel="Go"
      buttonHref={playlists.length > 0 ? '/discover/playlists' : undefined}
    >
      {playlists.length > 0 ? (
        <div className={TRACK_GRID_CLASS}>
          {playlists.map((playlist) => (
            <PlaylistItem key={playlist.id} info={playlist} />
          ))}
        </div>
      ) : (
        <EmptyState>Nothing here yet!</EmptyState>
      )}
    </Section>
  );
}
