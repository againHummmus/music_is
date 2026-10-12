import { getCurrentUser } from '@/actions/session';
import { searchPlaylists } from '@/actions/playlistApi';
import { searchAlbums } from '@/actions/albumApi';
import type { AlbumRow } from '@/actions/types';
import { CreateScreen } from '@/screens/artist/create/CreateScreen';

export default async function Page() {
  const user = await getCurrentUser();

  const [playlist, albums] = await Promise.all([
    user?.id
      ? searchPlaylists({
          name: 'Added by me',
          isDefault: true,
          creatorId: user.id,
        })
          .then((res) => res[0] ?? null)
          .catch(() => null)
      : Promise.resolve(null),
    user?.artistId
      ? searchAlbums({ artistId: user.artistId }).catch((): AlbumRow[] => [])
      : Promise.resolve([]),
  ]);

  return <CreateScreen playlist={playlist} albums={albums} />;
}
