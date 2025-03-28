import Link from "next/link";
import IcRoundAlbum from '~icons/ic/round-album';
import BiSoundwave from '~icons/bi/soundwave';

export default function Create() {

    return (
        <div className="w-full h-full flex items-center justify-center">
            <div className="flex flex-col items-center gap-[20px] justify-center">
                <h2 className="w-full text-3xl font-semibold text-mainBlack text-center">
                    What do you want to do?
                </h2>
                <div className="w-full justify-evenly flex flex-col main:flex-row mb-6 bg-white p-[20px] rounded-[7px] divide-y main:divide-x main:divide-y-0 divide-mainDark">
                    <Link href="/create/create-album" className="w-full max-main:pb-20 flex flex-col justify-center items-center hover:text-mainOrange transition-all">
                        <IcRoundAlbum className="w-[60px] h-[60px]" />
                        <div>Create album</div>
                    </Link>
                    <Link href="/create/upload-track" className="w-full max-main:pt-20 flex flex-col justify-center items-center hover:text-mainOrange transition-all">
                        <BiSoundwave className="w-[60px] h-[60px]" />
                        <div>Upload track</div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
