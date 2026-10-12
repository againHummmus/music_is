'use client';

import { TrackItem } from '@/components/track/TrackItem';
import { TRACK_GRID_CLASS } from '@/components/ui/SectionSkeleton';
import type { PlaylistWithTracksRow } from '@/actions/types';

export function PlaylistTrackList({
  playlist,
  limit,
}: {
  playlist: PlaylistWithTracksRow;
  limit?: number;
}) {
  const tracks = playlist.Playlist_track.slice(0, limit).flatMap((pt) =>
    pt.Track ? [pt.Track] : []
  );

  return (
    <div className={TRACK_GRID_CLASS}>
      {tracks.map((track) => (
        <TrackItem key={track.id} info={track} playlist={playlist} />
      ))}
    </div>
  );
}
