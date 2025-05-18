'use client'

import { useState, useEffect } from "react";
import { createImgUrl } from "@/components/shared/utils/createUrlFromHash";
import Image from "next/image";
import UserApi from "@/actions/userApi";
import { useStore } from "@/app/store";
import { PlaylistItem } from "@/components/shared/playlist/PlaylistItem";
import { ArrowButton } from "@/components/shared/buttons/ArrowButton";

export const dynamic = 'force-dynamic';

export default function User({ params }: { params: any }) {
    const store = useStore()
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const is_current_user = store.user === user;
    useEffect(() => {
        async function fetchUser() {
            setIsLoading(true);
            await UserApi.getUser({ id: params.id })
                .then(setUser);
            setIsLoading(false);
        }
        fetchUser();
    }, [params.id]);


    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full w-full">
                <div className="w-30 h-30 border-4 border-mainOrange border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-20 w-full">
            <div
                className="relative w-full flex flex-row items-center justify-between bg-cover bg-center after:backdrop-blur-sm rounded-[7px] p-20 main:p-30
                   after:absolute after:content-'' after:w-full after:h-full after:top-0 after:left-0
                   after:bg-gradient-to-l from-mainBlack/80 to-mainBlack/30 after:rounded-[7px]"
                style={{
                    backgroundImage: user?.avatar_url
                        ? `url(${createImgUrl(user?.avatar_url)})`
                        : 'url("/images/placeholderAvatar.jpg")',
                }}
            >
                <div className="flex flex-row gap-20 items-center">
                    <Image
                        src={
                            user?.avatar_url
                                ? createImgUrl(user?.avatar_url)
                                : "/images/placeholderAvatar.jpg"
                        }
                        alt="playlist image"
                        width={150}
                        height={150}
                        className="z-[1000] w-[80px] h-[80px] main:w-[150px] main:h-[150px] object-cover aspect-square rounded-[7px]"
                    />
                    <div className="z-[1000] flex flex-col max-w-[400px] justify-center gap-10 text-white">
                        <h2 className="text-[24px] laptop:text-[40px] leading-none font-bold">
                            {user?.username}
                        </h2>
                    </div>
                </div>
            </div>


            {user?.User_playlist.length > 0 ? (
                <div className="grid grid-cols-1 laptop:grid-cols-2 w-full gap-10">
                    {user?.User_playlist?.filter((pt: any) => pt.Playlist?.is_public === true).map((pt: any) => (
                        <div key={pt.id} className="relative flex items-center">
                            {pt.Playlist && <PlaylistItem info={pt.Playlist} />}
                        </div>
                    ))}
                </div>
            ) : (
                null
            )}
                {user?.User_playlist.length > 0 && <ArrowButton title={"Go"} href={"/discover/user/" + user?.id + '/playlists'} color={"mainOrange"} maxWidth="100px" />}
        </div>
    );
}
