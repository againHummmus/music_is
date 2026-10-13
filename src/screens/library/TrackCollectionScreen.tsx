import { Section } from '@/components/ui/Section';
import { EmptyState } from '@/components/ui/EmptyState';
import { TrackList } from '@/components/track/TrackList';
import type { TrackRow } from '@/actions/types';
import type { TrackCollection } from './trackCollections';

const FULL_LIST_SIZE = 100;

export async function TrackCollectionScreen({ collection }: { collection: TrackCollection }) {
  const tracks = await collection.load(FULL_LIST_SIZE).catch((): TrackRow[] => []);

  return (
    <Section title={collection.title}>
      {tracks.length > 0 ? (
        <TrackList tracks={tracks} queueId={`library-${collection.slug}`} />
      ) : (
        <EmptyState>{collection.emptyText}</EmptyState>
      )}
    </Section>
  );
}
