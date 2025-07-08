'use client'

import { useState, useEffect } from 'react'
import UserApi from '@/actions/userApi'
import AlbumApi from '@/actions/albumApi'
import AlbumCard from '@/components/album/AlbumItem'
import Link from 'next/link'
import { ArrowButton } from '../shared/buttons/ArrowButton'


export default function UserAlbumsBlock({ userId, limit = 4 }: { userId: string, limit?: number }) {

    const [albums, setAlbums] = useState<any[]>([])
    const [user, setUser] = useState<any>()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (!userId) {
            setIsLoading(false)
            return
        }

        const fetchData = async () => {
            setIsLoading(true)
            try {
                const userData = await UserApi.getUser({ id: userId });
                setUser(userData);

                if (userData?.Artist?.id) {
                    const albumData = await AlbumApi.searchAlbums({
                        artistId: userData.Artist.id,
                        limit: limit,
                        offset: 0,
                    }).then(res => res.data);

                    setAlbums(albumData || []);
                }
            } catch (error) {
                console.error("Failed to fetch user albums:", error)
                setAlbums([])
            } finally {
                setIsLoading(false)
            }
        }

        fetchData();
    }, [userId, limit]);

    if (isLoading) {
        return (
            <div>
                <div className="bg-neutral-700 h-8 w-48 mb-4 rounded animate-pulse"></div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Array.from({ length: limit }).map((_, i) => (
                        <div key={i} className="bg-neutral-800 rounded-lg aspect-square animate-pulse" />
                    ))}
                </div>
            </div>
        )
    }

    if (albums.length === 0) {
        return null;
    }

    return (
        <div className='flex flex-col gap-10'>
            <div className="flex justify-between items-center mb-4 ">
                <h2 className='text-2xl font-bold'>
                    Albums by <span className='text-mainOrange'>{user?.username}</span>
                </h2>
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">
                {albums.map((album: any) => (
                    <AlbumCard key={album.id} album={album} />
                ))}
            </div>
            <ArrowButton
                title="Go"
                href={`discover/user/${userId}/albums`} color="mainOrange"
                maxWidth="100px"
            />
        </div>
    )
}