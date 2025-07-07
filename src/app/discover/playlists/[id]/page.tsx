'use client'

import { useState, useEffect } from "react";
import PlaylistApi from "@/actions/playlistApi";
import PlaylistTrackApi from "@/actions/playlistTrackApi";
import { Track } from "@/components/shared/track/TrackItem";
import { createImgUrl } from "@/components/shared/utils/createUrlFromHash";
import Image from "next/image";
import HugeiconsDelete02 from '~icons/hugeicons/delete-02?width=48px&height=48px';
import FriendsList from "@/components/shared/utils/ui/AddUserToPlaylist";
import HugeiconsUserGroup from "~icons/hugeicons/user-group?width=24px&height=24px";

export const dynamic = 'force-dynamic';

export default function Playlist({ params }: { params: any }) {
    const [playlist, setPlaylist] = useState<any>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showAddFriends, setShowAddFriends] = useState(false);

    useEffect(() => {
        async function fetchPlaylist() {
            setIsLoading(true);
            const pl = await PlaylistApi.searchPlaylists({ id: params.id })
                .then(res => res[0]);
            setPlaylist(pl);
            setIsLoading(false);
        }
        fetchPlaylist();
    }, [params.id]);

    const handleDelete = async (trackId: string) => {
        try {
            await PlaylistTrackApi.deletePlaylistTrack({ id: trackId });
            setPlaylist((prev: any) => ({
                ...prev,
                Playlist_track: prev.Playlist_track.filter((pt: any) => pt.id !== trackId)
            }));
        } catch (err) {
            console.error("Failed to delete track:", err);
        }
    };


    const handleAddFriendsClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        setShowAddFriends(!showAddFriends);
    }

    const handleClickOutside = (e: any) => {
        if (!(e.target as Element).closest(`#add-friends-button`)) {
            setShowAddFriends(false);
        }
    };

    useEffect(() => {
        window.addEventListener('click', handleClickOutside);
        return () => {
            window.removeEventListener('click', handleClickOutside);
        };
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full">
                <div className="w-30 h-30 border-4 border-mainOrange border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }
    return (
        <div className="flex flex-col gap-20">
            <div
                className="relative w-full flex flex-row items-center justify-between bg-cover bg-center after:backdrop-blur-sm rounded-[7px] p-20 main:p-30
                   after:absolute after:content-'' after:w-full after:h-full after:top-0 after:left-0
                   after:bg-gradient-to-l from-mainBlack/80 to-mainBlack/30 after:rounded-[7px]"
                style={{
                    backgroundImage: playlist.Playlist_track?.[0]?.Track.Album.image_hash
                        ? `url(${createImgUrl(playlist.Playlist_track?.[0].Track.Album.image_hash)})`
                        : 'url("/images/recordersBackground.png")',
                }}
            >
                <div className="flex flex-row gap-20 items-center">
                    <Image
                        src={
                            playlist.Playlist_track?.[0]?.Track.Album.image_hash
                                ? createImgUrl(playlist.Playlist_track?.[0].Track.Album.image_hash)
                                : "/images/recordersBackground.png"
                        }
                        alt="playlist image"
                        width={150}
                        height={150}
                        className="z-[1000] w-[80px] h-[80px] main:w-[150px] main:h-[150px] object-cover aspect-square rounded-[7px]"
                    />
                    <div className="z-[1000] flex flex-col max-w-[400px] justify-center gap-10 text-white">
                        <h2 className="text-base laptop:text-[40px] leading-none font-bold">
                            {playlist.name}
                        </h2>
                        {playlist.description && <p className="text-sm laptop:text-[15px]">
                            {playlist.description}
                        </p>}
                        <p className="flex main:hidden laptop:text-[15px] text-white/80">
                            by {playlist.Creator.username}
                        </p>
                    </div>
                </div>
                <div className='z-[1000] flex flex-col h-[80px] main:h-[150px] gap-10 justify-between'>
                    <div className='flex flex-col gap-10'>
                        <p className="hidden main:flex laptop:text-[15px] text-white/80">
                            by {playlist.Creator.username}
                        </p>
                        {!playlist.is_default && <button id='add-friends-button' onClick={(e) => handleAddFriendsClick(e)} className='relative flex justify-end'>
                            <div className='flex flex-row items-center text-mainOrange italic gap-5'>
                                <HugeiconsUserGroup />
                                <p className='text-xs main:text-sm'>Add friends</p>
                            </div>
                            {showAddFriends && <FriendsList existingCollaborators={playlist.User_playlist} className='absolute top-[calc(100%+5px)] right-0' playlistId={params.id} />}
                        </button>}
                    </div>


                    {!playlist.is_default && playlist.Playlist_track.length > 0 && <button
                        onClick={() => setIsEditMode(!isEditMode)}
                        className="self-end px-4 py-2 bg-mainOrange text-white rounded"
                    >
                        {isEditMode ? "Done" : "Edit"}
                    </button>
                    }
                </div>
            </div>


            {playlist.Playlist_track.length > 0 ? (
                <div className="grid grid-cols-1 laptop:grid-cols-2 w-full gap-10 mb-[10px] laptop:mb-[15px]">
                    {playlist.Playlist_track?.map((pt: any) => (
                        <div key={pt.id} className="relative flex items-center">
                            <Track info={pt.Track} playlist={playlist} className={`${isEditMode ? 'w-[calc(100%-70px)] pr-[20px]' : 'w-full'}`} />
                            <button
                                onClick={() => handleDelete(pt.id)}
                            >
                                <HugeiconsDelete02 className='absolute -z-[1000]  right-[20px] top-1/2 -translate-y-1/2 w-[30px] h-[30px] text-badRed' />
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="w-full text-center">
                    Looks like this playlist is still empty!
                </div>
            )}
        </div>
    );
}
