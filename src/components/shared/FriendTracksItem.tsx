import { Track } from "./track/TrackItem";
import { ArrowButton } from "./buttons/ArrowButton";

export function FriendsTrackBlock() {

  return (
    <div className="w-full flex flex-col items-center gap-10">
      <ArrowButton title={"Andy"} href={"/users/andyorwhatever"} color={"bg-funnyBlue"}/>
      <div className="w-full flex flex-col gap-10">
        <Track />
        <Track />
        <Track />
      </div>
    </div>
  );
}

