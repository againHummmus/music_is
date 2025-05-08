'use client'
import Link from 'next/link';
import BiPlayCircle from '~icons/bi/play-circle?width=16px&height=16px';
import { createImgUrl } from '../utils/createUrlFromHash';

export function PlaylistItem({ info }: { info: any }) {
  return (
    <Link className="relative w-full max-w-[680px] h-[70px] main:h-[90px] flex items-center justify-between bg-cover bg-center rounded-[7px] p-20 after:absolute after:content-'' after:w-full after:h-full after:top-0 after:left-0 after:bg-gradient-to-r from-mainBlack/95 to-mainBlack/20 after:transition-all after:opacity-90 after:hover:opacity-100 after:rounded-[7px]" href={'/library/playlists/' + info?.id}
    style={{backgroundImage: `url(${info?.Playlist_track[0]?.Track.Album.image_hash ? createImgUrl(info?.Playlist_track[0]?.Track.Album.image_hash) : '/images/recordersBackground.png'})`}}>
      <div className="relative z-10 flex items-center gap-4 text-mainWhite">
        <BiPlayCircle className="h-[50px] w-[50px] hover:text-mainOrange cursor-pointer transition-all" />
        <div className="flex flex-col justify-center h-[40px]">
          <div className="font-medium text-lg main:text-xl leading-none">
            {info?.name}
          </div>
          {!info.is_default ? <div className="text-xs main:text-sm text-lightStormy">
            by {info?.Creator.username }
          </div> : null}
        </div>
      </div>
    </Link>
  );
}
