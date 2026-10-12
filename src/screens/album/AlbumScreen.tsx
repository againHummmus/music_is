import { TrackItem } from '@/components/track/TrackItem';
import { createImgUrl } from '@/lib/utils/createUrlFromHash';
import Image from 'next/image';
import type { AlbumDetailsRow } from '@/actions/types';
import { EmptyState } from '@/components/ui/EmptyState';

export function AlbumScreen({ album }: { album: AlbumDetailsRow }) {
  const artistName = album.Artist?.name || 'Unknown Artist';

  return (
    <div className="flex flex-col gap-20">
      <div
        className="relative flex w-full flex-row items-center justify-between rounded-[7px] from-mainBlack/80 to-mainBlack/30 bg-cover bg-center p-20 after:absolute after:left-0 after:top-0 after:h-full after:w-full after:rounded-[7px] after:bg-gradient-to-l after:backdrop-blur-sm after:content-[''] main:p-30"
        style={{
          backgroundImage: album.image_hash
            ? `url(${createImgUrl(album.image_hash)})`
            : 'url("/images/recordersBackground.png")',
        }}
      >
        <div className="flex flex-row items-center gap-20">
          <Image
            src={
              album.image_hash
                ? createImgUrl(album.image_hash)
                : '/images/recordersBackground.png'
            }
            alt="album image"
            width={150}
            height={150}
            className="z-[1000] aspect-square h-[80px] w-[80px] rounded-[7px] object-cover main:h-[150px] main:w-[150px]"
          />
          <div className="z-[1000] flex max-w-[400px] flex-col justify-center gap-10 text-white">
            <h2 className="text-base font-bold leading-none laptop:text-[40px]">
              {album.name}
            </h2>
            <p className="text-sm laptop:text-[15px]">
              {artistName} • {album.year}
            </p>
          </div>
        </div>
      </div>

      {album.Track && album.Track.length > 0 ? (
        <div className="mb-[10px] grid w-full grid-cols-1 gap-10 laptop:mb-[15px] laptop:grid-cols-2">
          {album.Track?.map((track) => (
            <TrackItem key={track.id} info={track} className="w-full" />
          ))}
        </div>
      ) : (
        <EmptyState>Looks like the album is empty!</EmptyState>
      )}
    </div>
  );
}
