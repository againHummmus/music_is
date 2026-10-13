import { getCurrentUser } from '@/actions/session';
import { getMyArtistTracks } from '@/actions/libraryApi';
import { searchAlbums } from '@/actions/albumApi';
import type { AlbumRow, TrackWithStatsRow } from '@/actions/types';
import { CreateScreen } from '@/screens/artist/create/CreateScreen';

export default async function Page() {
  const user = await getCurrentUser();

  const [tracks, albums] = await Promise.all([
    user ? getMyArtistTracks().catch((): TrackWithStatsRow[] => []) : Promise.resolve([]),
    user?.artistId
      ? searchAlbums({ artistId: user.artistId }).catch((): AlbumRow[] => [])
      : Promise.resolve([]),
  ]);

  return <CreateScreen tracks={tracks} albums={albums} />;
}
