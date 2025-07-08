// app/album/[id]/page.tsx

'use client'

import { useState, useEffect } from "react";
import { Track } from "@/components/shared/track/TrackItem";
import { createImgUrl } from "@/components/shared/utils/createUrlFromHash";
import Image from "next/image";
import StreamlineSleep from '~icons/streamline/sleep?width=48px&height=48px';
import AlbumApi from "@/actions/albumApi";


export const dynamic = 'force-dynamic';

export default function AlbumPage({ params }: { params: { id: string } }) {
    const [album, setAlbum] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchAlbum() {
            setIsLoading(true);
            try {
                const albumData = await AlbumApi.searchAlbums({ id: params.id })
                    .then((res: any) => res.data[0]); 
                setAlbum(albumData);
            } catch (error) {
                console.error("Failed to fetch album:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchAlbum();
    }, [params.id]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full">
                <div className="w-30 h-30 border-4 border-mainOrange border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!album && !isLoading) {
        return (
             <div className='flex flex-col h-[230px] gap-20 rounded-[7px] border border-mainOrange border-dashed items-center justify-center text-mainOrange'>
                <StreamlineSleep className='w-[40px] h-[40px]' />
                <p>Couldn't load the album. Try again later.</p>
            </div>
        )
    }

    const artistName = album.Track?.[0]?.Artist?.name || 'Unknown Artist';

    return (
        <div className="flex flex-col gap-20">
            <div
                className="relative w-full flex flex-row items-center justify-between bg-cover bg-center after:backdrop-blur-sm rounded-[7px] p-20 main:p-30
                           after:absolute after:content-'' after:w-full after:h-full after:top-0 after:left-0
                           after:bg-gradient-to-l from-mainBlack/80 to-mainBlack/30 after:rounded-[7px]"
                style={{
                    backgroundImage: album.image_hash
                        ? `url(${createImgUrl(album.image_hash)})`
                        : 'url("/images/recordersBackground.png")',
                }}
            >
                <div className="flex flex-row gap-20 items-center">
                    <Image
                        src={
                            album.image_hash
                                ? createImgUrl(album.image_hash)
                                : "/images/recordersBackground.png"
                        }
                        alt="album image"
                        width={150}
                        height={150}
                        className="z-[1000] w-[80px] h-[80px] main:w-[150px] main:h-[150px] object-cover aspect-square rounded-[7px]"
                    />
                    <div className="z-[1000] flex flex-col max-w-[400px] justify-center gap-10 text-white">
                        <h2 className="text-base laptop:text-[40px] leading-none font-bold">
                            {album.name}
                        </h2>
                        <p className="text-sm laptop:text-[15px]">
                            {artistName} • {album.year}
                        </p>
                    </div>
                </div>
            </div>

            {album.Track && album.Track.length > 0 ? (
                <div className="grid grid-cols-1 laptop:grid-cols-2 w-full gap-10 mb-[10px] laptop:mb-[15px]">
                    {album.Track?.map((track: any) => (
                        <Track key={track.id} info={track} className="w-full" />
                    ))}
                </div>
            ) : (
                <div className='flex flex-col h-[230px] gap-20 rounded-[7px] border border-mainOrange border-dashed items-center justify-center text-mainOrange'>
                    <StreamlineSleep className='w-[40px] h-[40px]' />
                    <p>Looks like the album is empty!</p>
                </div>
            )}
        </div>
    );
}