'use client'
import BiPlayCircle from '~icons/bi/play-circle?width=16px&height=16px';

export function PlaylistItem() {
    return (
        <div className="relative w-full max-w-[680px] h-[70px] tablet:h-[90px] flex flex-row justify-between items-center bg-[url('/images/track.png')] bg-center bg-cover rounded-[7px] p-20 after:absolute after:content-'' after:w-full after:h-full after:top0 after:left-0 after:bg-gradient-to-r from-mainBlack/80 to-mainBlack/10 after:rounded-[7px]">
            <div className="relative z-[500] flex flex-row justify-center gap-10 text-mainWhite">
                <BiPlayCircle className="h-[50px] w-[50px] hover:text-mainOrange transition-all cursor-pointer"/>
                <div className="h-[40px] flex flex-col justify-between">
                    <div className="font-medium text-lg tablet:text-xl">
                        Remember
                    </div>
                    <div className="text-xs tablet:text-sm text-lightStormy">
                        by Andy
                    </div>
                </div>
            </div>
        </div>
    );
}