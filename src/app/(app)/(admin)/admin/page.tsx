import Link from 'next/link';
import IcRoundAlbum from '~icons/ic/round-album';
import BiSoundwave from '~icons/bi/soundwave';
import MingcuteMicrophoneLine from '~icons/mingcute/microphone-line';
import TablerHandRock from '~icons/tabler/hand-rock?width=48px&height=48px';

export default function Page() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-[20px]">
        <h2 className="w-full text-center text-3xl font-semibold text-mainBlack">
          Pick an action:
        </h2>
        <div className="mb-6 flex w-full flex-col justify-evenly divide-y divide-mainDark rounded-[7px] bg-white p-[20px] laptop:flex-row laptop:divide-x laptop:divide-y-0">
          <Link
            href="/admin/create-album"
            className="flex w-full min-w-[150px] flex-col items-center justify-center transition-all hover:text-mainOrange max-laptop:pb-20"
          >
            <IcRoundAlbum className="h-[60px] w-[60px]" />
            <div>Create album</div>
          </Link>
          <Link
            href="/admin/upload-track"
            className="flex w-full min-w-[150px] flex-col items-center justify-center transition-all hover:text-mainOrange max-laptop:p-20"
          >
            <BiSoundwave className="h-[60px] w-[60px]" />
            <div>Upload track</div>
          </Link>
          <Link
            href="/admin/create-artist"
            className="flex w-full min-w-[150px] flex-col items-center justify-center transition-all hover:text-mainOrange max-laptop:p-20"
          >
            <MingcuteMicrophoneLine className="h-[60px] w-[40px]" />
            <div>Create artist</div>
          </Link>
          <Link
            href="/admin/create-genre"
            className="flex w-full min-w-[150px] flex-col items-center justify-center transition-all hover:text-mainOrange max-laptop:pt-20"
          >
            <TablerHandRock className="h-[60px] w-[40px]" />
            <div>Create genre</div>
          </Link>
        </div>
      </div>
    </div>
  );
}

