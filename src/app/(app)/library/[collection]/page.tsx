import { notFound } from 'next/navigation';
import { findTrackCollection } from '@/screens/library/trackCollections';
import { TrackCollectionScreen } from '@/screens/library/TrackCollectionScreen';

export const dynamic = 'force-dynamic';

export default function Page({ params }: { params: { collection: string } }) {
  const collection = findTrackCollection(params.collection);
  if (!collection) notFound();

  return <TrackCollectionScreen collection={collection} />;
}
