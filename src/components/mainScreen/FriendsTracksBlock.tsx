import { BaseButtonOutline } from "../shared/buttons/BaseButtonOutline";
import { FriendsTrackBlock } from "../shared/FriendTracksItem";

export function FriendsBlock() {

    return (
        <div>
            <div
                className="mb-[10px] main:mb-[15px] flex relative flex-col gap-[10px] main:gap-0 main:flex-row w-full after:z-0 after:absolute after:content-'' after:rounded-[7px] after:top-0 after:left-0 after:w-full after:h-full after:bg-gradient-to-r after:from-black/60 after:to-black/0  bg-[url('/images/friendsBannerBackground.png')] bg-cover rounded-[7px] pl-[30px] pr-[15px] py-[15px]"
            >
                <div className="w-full relative z-[2] font-semibold text-center main:text-left text-3xl desktop:text-[32px] text-mainOrange">
                    Your friends <br/> like this
                </div>
                <div className="w-full relative z-[2] flex flex-col main:justify-end items-center main:items-end">
                    <BaseButtonOutline title={"See more"} href={"/user13131/friends"}/>
                </div>
            </div>
            <div className="grid grid-cols-1 main:grid-cols-2 gap-10">
                <FriendsTrackBlock/>
                <FriendsTrackBlock/>
            </div>
            
        </div>
    );
}
