import { FriendsTrackBlock } from "@components/shared/FriendTracksItem";

export async function FriendsBlock() {

    return (
        <div>
            <div
                className="mb-[10px] tablet:mb-[15px] flex relative flex-col gap-[10px] tablet:gap-0 tablet:flex-row w-full after:z-0 after:absolute after:content-'' after:rounded-[7px] after:top-0 after:left-0 after:w-full after:h-full after:bg-gradient-to-r after:from-black/60 after:to-black/0  bg-[url('/images/friendsBannerBackground.png')] bg-cover rounded-[7px] pl-[30px] pr-[15px] py-[15px]"
            >
                <div className="w-full relative z-[2] font-semibold text-center tablet:text-left text-3xl desktop:text-[32px] text-mainOrange">
                    Your friends <br/> like this
                </div>
                <div className="w-full relative z-[2] flex flex-col tablet:justify-end items-center tablet:items-end">
                    <button className="w-full backdrop-blur-lg font-bold h-[30px] tablet:h-[50px] max-w-[400px] rounded-[7px] border-2 border-mainOrange hover:border-white hover:text-white transition-all flex items-center justify-center text-mainOrange transition-all">
                        See more
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-1 tablet:grid-cols-2 gap-10">
                <FriendsTrackBlock/>
                <FriendsTrackBlock/>
            </div>
            
        </div>
    );
}
