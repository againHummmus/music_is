import { searchPlaylists } from '@/actions/playlistApi';
import PlaylistScreen from './Screen';
import StreamlineSleep from '~icons/streamline/sleep?width=48px&height=48px';

export default async function Page({ params }: { params: any }) {
  const results = await searchPlaylists({ id: params.id, limit: 1 });
  const playlist = results[0] ?? null;

      if (!playlist) {
        return (
          <div className="flex h-[230px] flex-col items-center justify-center gap-20 rounded-[7px] border border-dashed border-mainOrange text-mainOrange">
            <StreamlineSleep className="h-[40px] w-[40px]" />
            <p>Playlist not found:(</p>
          </div>
        );
      }

  return <PlaylistScreen params={params} initialPlaylist={playlist} />;
}
