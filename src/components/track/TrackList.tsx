'use client';

import { TrackItem } from '@/components/track/TrackItem';
import { TRACK_GRID_CLASS } from '@/components/ui/SectionSkeleton';
import type { TrackRow } from '@/actions/types';

export function TrackList({
  tracks,
  queueId,
}: {
  tracks: TrackRow[];
  queueId: string;
}) {
  const queue = { id: queueId, tracks };

  return (
    <div className={TRACK_GRID_CLASS}>
      {tracks.map((track) => (
        <TrackItem key={track.id} info={track} queue={queue} />
      ))}
    </div>
  );
}
