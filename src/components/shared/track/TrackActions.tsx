'use client'

import { useState, useEffect } from 'react'
import { useStore } from '@/app/store'
import HugeiconsPlaylist01 from '~icons/hugeicons/playlist-01?width=24px&height=24px'
import HugeiconsArrowUp02 from '~icons/hugeicons/arrow-up-02'
import PlaylistTrackApi from '@/actions/playlistTrackApi'
import UserPlaylistApi from '@/actions/userPlaylistApi'

const ActionTypes = {
    AddToPlaylist: 'addToPlaylist',
} as const
type ActionType = typeof ActionTypes[keyof typeof ActionTypes]

export function TrackActions({
    setMenuOpen,
}: {
    setMenuOpen: (open: boolean) => void
}) {
    const store = useStore()
    const track = store.chosenTrack

    const [userPlaylistConnections, setUserPlaylistConnections] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [action, setAction] = useState<ActionType | undefined>(undefined)

    useEffect(() => {
        if (!store.user?.id) return
        (async function () {
            setLoading(true)
            await UserPlaylistApi.searchUserPlaylists({ userId: store.user.id, includeDefaultPlaylists: false })
                .then((res: any) => setUserPlaylistConnections(res.data))
                .catch(console.error)
                .finally(() => setLoading(false))
        })()
    }, [store.user?.id])

    const handleAdd = async (playlist: any) => {
        if (!track) return
        try {
            await PlaylistTrackApi.createPlaylistTrack({
                trackId: track.id,
                playlistId: playlist.id,
            })
            setMenuOpen(false)
        } catch (err) {
            console.error('Failed to add track to playlist:', err)
        }
    }

    const renderActionBlock = () => {
        switch (action) {
            case ActionTypes.AddToPlaylist:
                return (
                    <>
                        <div className="w-full" onClick={(e) => {e.stopPropagation(); setAction(undefined)}}>
                            <HugeiconsArrowUp02 className="-rotate-90 cursor-pointer hover:text-mainOrange" />
                        </div>
                        <p className="px-2 py-1 text-sm font-medium">
                            Add {track?.name} to:
                        </p>
                        {loading ? (
                            <div className="space-y-2 px-2">
                                {[...Array(4)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="h-6 bg-gray-200 animate-pulse rounded"
                                    />
                                ))}
                            </div>
                        ) : userPlaylistConnections.length === 0 ? (
                            <p className="px-2 py-1 text-sm text-gray-500">
                                You have no playlists
                            </p>
                        ) : (
                            userPlaylistConnections.map(pl => (
                                <button
                                    key={pl.Playlist.id}
                                    onClick={() => handleAdd(pl.Playlist)}
                                    className="group w-full flex items-center gap-2 px-2 py-1 text-left text-sm hover:bg-mainBlack/[3%] rounded"
                                >
                                    <span className="truncate text-mainBlack group-hover:text-mainOrange transition-all">
                                        {pl.Playlist.name}
                                    </span>
                                </button>
                            ))
                        )}
                    </>
                )
            default:
                return (
                    <button
                        onClick={(e) => {e.stopPropagation(); setAction(ActionTypes.AddToPlaylist)}}
                        className="w-full text-left text-sm p-2 hover:bg-gray-100 flex flex-row gap-5 items-center rounded"
                    >
                        <HugeiconsPlaylist01 className="w-[25px] h-[25px]" />
                        <span className="whitespace-nowrap">Add to playlist</span>
                    </button>
                )
        }
    }

    return <>{renderActionBlock()}</>
}
