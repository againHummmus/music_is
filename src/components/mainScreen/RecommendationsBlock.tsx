'use client';
import { Track } from '../shared/track/TrackItem';
import { useStore } from '@/app/store';
import { searchPlaylists } from '@/actions/playlistApi';
import { ContentBlock } from '../shared/ContentBlock';

export function RecommendationsBlock() {
  const currentUser = useStore((state) => state.user);

  if (!currentUser) return null;

  return (
    <ContentBlock
      title="Your friends like:"
      fetchItems={async () => {
        const playlist = await searchPlaylists({
          name: 'Your friends like this',
          isDefault: true,
          creatorId: currentUser?.id,
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
