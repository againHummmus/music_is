import userPlaylistApi from '@/actions/userPlaylistApi';
import SubscriptionApi from '@/actions/userSubscriptionApi';
import { useStore } from '@/app/store';
import React, { useState, useEffect } from 'react';

const LIMIT = 20;

export default function FriendsList({ existingCollaborators, playlistId, className }: { existingCollaborators: any[], playlistId: any, className?: string }) {
    const currentUser = useStore(state => state.user)
    const [friends, setFriends] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const existingCollaboratorIds = new Set(existingCollaborators.map(collab => collab.User));


    useEffect(() => {
        if (!currentUser) return;
        let canceled = false;
        setLoading(true);

        SubscriptionApi.searchMutualFriends({
            userId: currentUser.id,
            limit: LIMIT,
        })
            .then((data: any[]) => {
                if (canceled) return;
                setFriends(prev => [...prev, ...data]);
            })
            .catch(console.error)
            .finally(() => {
                if (!canceled) setLoading(false);
            });

        return () => { canceled = true };
    }, [currentUser]);

    const handleAdd = (id: any) => {
        userPlaylistApi.createUserPlaylist({ userId: id, playlistId, isCreator: false })
    };

    if (!currentUser) {
        return <div className="p-8 text-center text-[#2F313A]">Please sign in to see your friends.</div>;
    }

    const filteredFriends = friends.filter(friend => !existingCollaboratorIds.has(friend.id))
    return (
        <div className={`${className} bg-white border border-darkStormy shadow-md rounded p-2 min-w-[200px`}>
            {loading ? (
                <p className="px-2 py-1 text-sm text-mainOrange">
                    loading firends...
                </p>
            ) : filteredFriends.length === 0 ? (
                <p className="px-2 py-1 text-sm text-gray-500">
                    You have no friends who aren't collaborators yet!
                </p>
            ) : (
                filteredFriends.map(friend => (
                    <button
                        key={friend.username}
                        onClick={() => handleAdd(friend.id)}
                        className="group w-full flex items-center gap-2 px-2 py-1 text-left text-sm hover:bg-mainBlack/[3%] rounded"
                    >
                        <span className="truncate text-mainBlack group-hover:text-mainOrange transition-all">
                            {friend.username}
                        </span>
                    </button>
                ))
            )}
        </div>
    );
};

