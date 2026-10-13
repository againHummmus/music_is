import Link from 'next/link';
import IcRoundAlbum from '~icons/ic/round-album';
import BiSoundwave from '~icons/bi/soundwave';
import type { AlbumRow, TrackWithStatsRow } from '@/actions/types';
import { AddedByMeBlock } from './AddedByMeBlock';

export function CreateScreen({
  tracks,
  albums,
}: {
  tracks: TrackWithStatsRow[];
  albums: AlbumRow[];
}) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-20 main:gap-40">
      <div className="flex w-fit flex-col items-center justify-center gap-[20px]">
        <h2 className="w-full text-center text-3xl font-semibold text-mainBlack">
          Pick an action:
        </h2>
        <div className="mb-6 flex w-full min-w-[300px] flex-col justify-evenly divide-y divide-mainDark rounded-[7px] bg-white p-[20px] main:flex-row main:divide-x main:divide-y-0">
          <Link
            href="/create/create-album"
            className="flex w-full flex-col items-center justify-center transition-all hover:text-mainOrange max-main:pb-20"
          >
            <IcRoundAlbum className="h-[60px] w-[60px]" />
            <div>Create album</div>
          </Link>
          <Link
            href="/create/upload-track"
            className="flex w-full flex-col items-center justify-center transition-all hover:text-mainOrange max-main:pt-20"
          >
            <BiSoundwave className="h-[60px] w-[60px]" />
            <div>Upload track</div>
          </Link>
        </div>
      </div>
      <AddedByMeBlock tracks={tracks} albums={albums} />
    </div>
  );
}

