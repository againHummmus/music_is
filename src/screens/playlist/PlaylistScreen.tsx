'use client';

import { useState, useEffect } from 'react';
import { deletePlaylistTrack } from '@/actions/playlistTrackApi';
import { TrackItem } from '@/components/track/TrackItem';
import { createImgUrl } from '@/lib/utils/createUrlFromHash';
import Image from 'next/image';
import HugeiconsDelete02 from '~icons/hugeicons/delete-02?width=48px&height=48px';
import { AddUserToPlaylist } from '@/screens/playlist/AddUserToPlaylist';
import HugeiconsUserGroup from '~icons/hugeicons/user-group?width=24px&height=24px';
import type { PlaylistRow } from '@/actions/types';
import { EmptyState } from '@/components/ui/EmptyState';

export function PlaylistScreen({
  initialPlaylist,
}: {
  initialPlaylist: PlaylistRow;
}) {
  const [playlist, setPlaylist] = useState(initialPlaylist);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showAddFriends, setShowAddFriends] = useState(false);

  const handleDelete = async (playlistTrackId: number) => {
    try {
      await deletePlaylistTrack({ id: playlistTrackId });
      setPlaylist((prev) => ({
        ...prev,
        Playlist_track: prev.Playlist_track.filter(
          (pt) => pt.id !== playlistTrackId
        ),
      }));
    } catch (err) {
      console.error('Failed to delete track:', err);
    }
  };

  const handleAddFriendsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowAddFriends(!showAddFriends);
  };

  const handleClickOutside = (e: MouseEvent) => {
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

  const coverHash = playlist.Playlist_track[0]?.Track?.Album?.image_hash;

  return (
    <div className="flex flex-col gap-20">
      <div
        className="relative flex w-full flex-row items-center justify-between rounded-[7px] from-mainBlack/80 to-mainBlack/30 bg-cover bg-center p-20 after:absolute after:left-0 after:top-0 after:h-full after:w-full after:rounded-[7px] after:bg-gradient-to-l after:backdrop-blur-sm after:content-[''] main:p-30"
        style={{
          backgroundImage: coverHash
            ? `url(${createImgUrl(coverHash)})`
            : 'url("/images/recordersBackground.png")',
        }}
      >
        <div className="flex flex-row items-center gap-20">
          <Image
            src={
              coverHash
                ? createImgUrl(coverHash)
                : '/images/recordersBackground.png'
            }
            alt="playlist image"
            width={150}
            height={150}
            className="z-[1000] aspect-square h-[80px] w-[80px] rounded-[7px] object-cover main:h-[150px] main:w-[150px]"
          />
          <div className="z-[1000] flex max-w-[400px] flex-col justify-center gap-10 text-white">
            <h2 className="text-base font-bold leading-none laptop:text-[40px]">
              {playlist.name}
            </h2>
            {playlist.description && (
              <p className="text-sm laptop:text-[15px]">
                {playlist.description}
              </p>
            )}
            <p className="flex text-white/80 main:hidden laptop:text-[15px]">
              by {playlist.Creator?.username}
            </p>
          </div>
        </div>
        <div className="z-[1000] flex h-[80px] flex-col justify-between gap-10 main:h-[150px]">
          <div className="flex flex-col gap-10">
            <p className="hidden text-white/80 main:flex laptop:text-[15px]">
              by {playlist.Creator?.username}
            </p>
            {!playlist.is_default && (
              <button
                id="add-friends-button"
                onClick={(e) => handleAddFriendsClick(e)}
                className="relative flex justify-end"
              >
                <div className="flex flex-row items-center gap-5 italic text-mainOrange">
                  <HugeiconsUserGroup />
                  <p className="text-xs main:text-sm">Add friends</p>
                </div>
                {showAddFriends && (
                  <AddUserToPlaylist
                    existingCollaborators={playlist.User_playlist}
                    className="absolute right-0 top-[calc(100%+5px)]"
                    playlistId={playlist.id}
                  />
                )}
              </button>
            )}
          </div>

          {!playlist.is_default && playlist.Playlist_track.length > 0 && (
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className="self-end rounded bg-mainOrange px-4 py-2 text-white"
            >
              {isEditMode ? 'Done' : 'Edit'}
            </button>
          )}
        </div>
      </div>

      {playlist.Playlist_track.length > 0 ? (
        <div className="mb-[10px] grid w-full grid-cols-1 gap-10 laptop:mb-[15px] laptop:grid-cols-2">
          {playlist.Playlist_track.map((pt) => pt.Track && (
            <div key={pt.id} className="relative flex items-center">
              <TrackItem
                info={pt.Track}
                playlist={playlist}
                className={`${isEditMode ? 'w-[calc(100%-70px)] pr-[20px]' : 'w-full'}`}
              />
              <button onClick={() => handleDelete(pt.id)}>
                <HugeiconsDelete02 className="absolute right-[20px] top-1/2 -z-[1000] h-[30px] w-[30px] -translate-y-1/2 text-badRed" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState>Looks like the playlist is still empty!</EmptyState>
      )}
    </div>
  );
}
