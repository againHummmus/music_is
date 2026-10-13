import { getCurrentUser } from '@/actions/session';
import { ArtistUploadTrackScreen } from '@/screens/artist/upload-track/ArtistUploadTrackScreen';

export default async function Page() {
  const user = await getCurrentUser();
  return <ArtistUploadTrackScreen initialUser={user} />;
}
