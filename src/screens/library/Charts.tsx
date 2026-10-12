'use client';
import { TrackItem } from '@/components/track/TrackItem';
import { useAuthStore } from '@/stores/authStore';
import { searchPlaylists } from '@/actions/playlistApi';
import { ContentBlock } from '@/components/ui/ContentBlock';

export function Charts() {
  const user = useAuthStore((s) => s.user);

  return (
    <ContentBlock
      title="CHARTS:"
      fetchItems={async () => {
        const playlist = await searchPlaylists({
          name: 'Recommendations',
          isDefault: true,
          creatorId: user?.id,
        }).then((res) => res[0]);
        return {
          items: (playlist?.Playlist_track ?? [])
            .slice(0, 6)
            .flatMap((pt) => (pt.Track ? [{ track: pt.Track, playlist }] : [])),
          buttonHref: playlist
            ? `/discover/playlists/${playlist.id}`
            : undefined,
        };
      }}
      renderItem={({ track, playlist }, index) => (
        <TrackItem key={index} info={track} playlist={playlist} />
      )}
      buttonLabel="Go"
      emptyLabel="Nothing here yet!"
    />
  );
}
