'use client';
import { Track } from '../shared/track/TrackItem';
import { useStore } from '@/app/store';
import { searchPlaylists } from '@/actions/playlistApi';
import { ContentBlock } from '../shared/ContentBlock';

export function Charts() {
  const { user } = useStore();

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
            .map((pt) => ({ pt, playlist })),
          buttonHref: playlist
            ? `/discover/playlists/${playlist.id}`
            : undefined,
        };
      }}
      renderItem={({ pt, playlist }, index) => (
        <Track key={index} info={pt.Track} playlist={playlist} />
      )}
      buttonLabel="Go"
      emptyLabel="Nothing here yet!"
    />
  );
}
