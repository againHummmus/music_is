import { Section } from '@/components/ui/Section';
import { EmptyState } from '@/components/ui/EmptyState';
import { TrackList } from '@/components/track/TrackList';
import type { TrackRow } from '@/actions/types';
import type { TrackCollection } from './trackCollections';

const PREVIEW_SIZE = 6;

export async function TrackCollectionBlock({ collection }: { collection: TrackCollection }) {
  const tracks = await collection.load(PREVIEW_SIZE + 1).catch((): TrackRow[] => []);

  return (
    <Section
      title={collection.title}
      buttonLabel="Go"
      buttonHref={tracks.length > PREVIEW_SIZE ? `/library/${collection.slug}` : undefined}>
      {tracks.length > 0 ? (
        <TrackList tracks={tracks.slice(0, PREVIEW_SIZE)} queueId={`library-${collection.slug}`} />
      ) : (
        <EmptyState>{collection.emptyText}</EmptyState>
      )}
    </Section>
  );
}
