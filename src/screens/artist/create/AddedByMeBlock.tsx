import { TrackItem } from '@/components/track/TrackItem';
import { ArrowButton } from '@/components/ui/buttons/ArrowButton';
import { AlbumItem } from '@/components/album/AlbumItem';
import type { PlaylistWithTrackStatsRow } from '@/actions/types';
import type { AlbumRow } from '@/actions/types';
import { EmptyState } from '@/components/ui/EmptyState';

export function AddedByMeBlock({
  playlist,
  albums,
}: {
  playlist: PlaylistWithTrackStatsRow | null;
  albums: AlbumRow[];
}) {
  return (
    <div className="w-full">
      <div className="mb-[10px] text-[24px] font-bold text-mainBlack max-main:w-full max-main:text-center main:mb-[15px]">
        Added by you:
      </div>
      {playlist?.Playlist_track && playlist.Playlist_track.length > 0 ? (
        <div className="mb-[10px] grid w-full grid-cols-1 gap-10 main:mb-[15px] main:grid-cols-[4fr,_1fr]">
          {playlist.Playlist_track.map((item, index) => {
            if (!item.Track) return null;
            return (
              <>
                <TrackItem key={index} info={item.Track} playlist={playlist} />
                <div className="felx-row flex items-center justify-center gap-[10px]">
                  <div className="flex items-center justify-center whitespace-nowrap text-mainOrange">
                    {item.Track.Track_like[0]?.count ?? 0} likes
                  </div>
                  <div className="size-[3px] rounded-full bg-mainOrange" />
                  <div className="flex items-center justify-center whitespace-nowrap text-mainOrange">
                    in {item.Track.Playlist_track[0]?.count ?? 0} playlists
                  </div>
                </div>
              </>
            );
          })}
        </div>
      ) : (
        <EmptyState>Nothing here yet!</EmptyState>
      )}
      {albums.length > 0 && (
        <div className="mb-[10px] grid w-full grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-10 main:mb-[15px]">
          {albums.map((item, index) => (
            <AlbumItem key={index} album={item} />
          ))}
        </div>
      )}
      {playlist && playlist.Playlist_track.length > 0 && (
        <ArrowButton
          title={'Go'}
          href={'/discover/playlists/' + playlist.id}
          color={'mainOrange'}
          maxWidth="100px"
        />
      )}
    </div>
  );
}
