import { createUserPlaylist } from '@/actions/userPlaylistApi';
import { searchMutualFriends } from '@/actions/userSubscriptionApi';
import type { MutualFriendRow } from '@/actions/types';
import type { PlaylistRow } from '@/actions/types';
import { useAuthStore } from '@/stores/authStore';
import React, { useState, useEffect } from 'react';

const LIMIT = 20;

export default function FriendsList({
  existingCollaborators,
  playlistId,
  className,
}: {
  existingCollaborators: PlaylistRow['User_playlist'];
  playlistId: number;
  className?: string;
}) {
  const currentUser = useAuthStore((state) => state.user);
  const [friends, setFriends] = useState<MutualFriendRow[]>([]);
  const [loading, setLoading] = useState(true);
  const existingCollaboratorIds = new Set(
    existingCollaborators.map((collab) => collab.User)
  );

  useEffect(() => {
    if (!currentUser) return;
    let canceled = false;

    searchMutualFriends({
      limit: LIMIT,
    })
      .then((data) => {
        if (canceled) return;
        setFriends((prev) => [...prev, ...data]);
      })
      .catch(console.error)
      .finally(() => {
        if (!canceled) setLoading(false);
      });

    return () => {
      canceled = true;
    };
  }, [currentUser]);

  const handleAdd = (id: number) => {
    createUserPlaylist({
      userId: id.toString(),
      playlistId: playlistId.toString(),
      isCreator: false,
    });
  };

  if (!currentUser) {
    return (
      <div className="p-8 text-center text-[#2F313A]">
        Please sign in to see your friends.
      </div>
    );
  }

  const filteredFriends = friends.filter(
    (friend) => !existingCollaboratorIds.has(friend.id)
  );
  return (
    <div
      className={`${className} min-w-[200px rounded border border-darkStormy bg-white p-2 shadow-md`}
    >
      {loading ? (
        <p className="px-2 py-1 text-sm text-mainOrange">loading firends...</p>
      ) : filteredFriends.length === 0 ? (
        <p className="px-2 py-1 text-sm text-gray-500">
          You have no friends who aren&apos;t collaborators yet!
        </p>
      ) : (
        filteredFriends.map((friend) => (
          <button
            key={friend.username}
            onClick={() => handleAdd(friend.id)}
            className="group flex w-full items-center gap-2 rounded px-2 py-1 text-left text-sm hover:bg-mainBlack/[3%]"
          >
            <span className="truncate text-mainBlack transition-all group-hover:text-mainOrange">
              {friend.username}
            </span>
          </button>
        ))
      )}
    </div>
  );
}
