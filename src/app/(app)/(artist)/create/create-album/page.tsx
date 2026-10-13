import { getCurrentUser } from '@/actions/session';
import { ArtistCreateAlbumScreen } from '@/screens/artist/create-album/ArtistCreateAlbumScreen';

export default async function Page() {
  const user = await getCurrentUser();
  return <ArtistCreateAlbumScreen initialUser={user} />;
}
