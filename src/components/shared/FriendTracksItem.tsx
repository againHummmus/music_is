import { Track } from './track/TrackItem';
import { ArrowButton } from './buttons/ArrowButton';

export async function FriendsTrackBlock() {
  return (
    <div className="flex w-full flex-col items-center gap-10">
      <ArrowButton
        title={'Andy'}
        href={'/users/andyorwhatever'}
        color={'funnyBlue'}
      />
      <div className="flex w-full flex-col gap-10">
        {/* <Track info={undefined} />
        <Track info={undefined} />
        <Track info={undefined} /> */}
      </div>
    </div>
  );
}
