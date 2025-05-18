'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { PlaylistItem } from '@/components/shared/playlist/PlaylistItem'
import UserPlaylistApi from '@/actions/userPlaylistApi'
import UserApi from '@/actions/userApi'

export default function MyPlaylistsBlock({ params }: { params: any }) {

    const LIMIT = 12
    const [userPlaylistConnections, setUserPlaylistConnections] = useState<any[]>([])
    const [user, setUser] = useState<any>()
    const [offset, setOffset] = useState(0)
    const [hasMore, setHasMore] = useState(true)
    const isFetchingRef = useRef(false)
    const loaderRef = useRef<HTMLDivElement | null>(null)

    const loadMore = useCallback(async () => {
        if (isFetchingRef.current || !hasMore || !params?.id) return
        isFetchingRef.current = true
        try {
            const data: any = await UserPlaylistApi.searchUserPlaylists({ userId: params.id, limit: 6, offset }).then((res: any) => setUserPlaylistConnections(res.data));
            setHasMore(data.length === LIMIT)
            setOffset(prev => prev + data.length)
        } catch (err) {
            console.error('Error loading playlists:', err)
        } finally {
            isFetchingRef.current = false
        }
    }, [params?.id, offset, hasMore])


    useEffect(() => {
        loadMore()
    }, [loadMore])

    useEffect(() => {
        const node = loaderRef.current
        if (!node) return
        const obs = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting) {
                    loadMore()
                }
            },
            { rootMargin: '200px' }
        )
        obs.observe(node)
        return () => obs.disconnect()
    }, [loadMore])

    useEffect(() => {
        async function fetchUser() {
            await UserApi.getUser({ id: params.id })
                .then(setUser);
        }
        fetchUser();
    }, [params.id]);

    return (
        <div>
            <p className='text-3xl  font-bold mb-20'>
                Playlists by <span className='text-mainOrange'>{user?.username}</span>
            </p>
            <div className='flex flex-col gap-10'>
                {isFetchingRef.current ? (
                    <div className="grid grid-cols-1 main:grid-cols-2 gap-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div
                                key={i}
                                className="h-[90px] bg-gray-200 animate-pulse rounded"
                            />
                        ))}
                    </div>
                ) : userPlaylistConnections.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                        You have no playlists yet.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 main:grid-cols-2 gap-4">
                        {userPlaylistConnections.map(conn => (
                            <PlaylistItem
                                key={conn.Playlist.id}
                                info={conn.Playlist}
                            />
                        ))}
                    </div>
                )}
    
                <div ref={loaderRef} />
    
                {isFetchingRef.current && userPlaylistConnections.length > 0 && (
                    <div className="text-center py-4 text-sm text-gray-500">
                        Loading more…
                    </div>
                )}
    
                {!hasMore && userPlaylistConnections.length > 0 && (
                    <div className="text-center py-4 text-sm text-gray-400">
                        You&apos;ve reached the end!
                    </div>
                )}
            </div>
        </div>
    )
}
