import { BaseButtonOutline } from '../shared/buttons/BaseButtonOutline';
import { FriendsTrackBlock } from '../shared/FriendTracksItem';

export async function FriendsBlock() {
  return (
    <div>
      <div className="after:content-'' relative mb-[10px] flex w-full flex-col gap-[10px] rounded-[7px] bg-[url('/images/friendsBannerBackground.png')] bg-cover py-[15px] pl-[30px] pr-[15px] after:absolute after:left-0 after:top-0 after:z-0 after:h-full after:w-full after:rounded-[7px] after:bg-gradient-to-r after:from-black/60 after:to-black/0 main:mb-[15px] main:flex-row main:gap-0">
        <div className="relative z-[2] w-full text-center text-3xl font-semibold text-mainOrange main:text-left desktop:text-[32px]">
          Your friends <br /> like this
        </div>
        <div className="relative z-[2] flex w-full flex-col items-center main:items-end main:justify-end">
          <BaseButtonOutline title={'See more'} href={'/user13131/friends'} />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-10 main:grid-cols-2">
        <FriendsTrackBlock />
        <FriendsTrackBlock />
      </div>
    </div>
  );
}
