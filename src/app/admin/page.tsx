'use client'

import Link from "next/link";
import IcRoundAlbum from '~icons/ic/round-album';
import BiSoundwave from '~icons/bi/soundwave';
import MingcuteMicrophoneLine from '~icons/mingcute/microphone-line';
import TablerHandRock from '~icons/tabler/hand-rock?width=48px&height=48px';
import { useStore } from "../store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import userApi from "@/actions/userApi";

export default function Admin() {
    const store = useStore((state) => state);
    const router = useRouter();

    useEffect(() => {
        (async () => {
            const user = await userApi.getMe();
            if (user?.app_role !== 'admin') {
                router.push("/");
                store.setModal({ isOpen: true, type: 'warning', message: 'You must be an admin to visit this page!' });
            }
        })()
    }, [])

    return (
        <div className="w-full h-full flex items-center justify-center">
            <div className="flex flex-col items-center gap-[20px] justify-center">
                <h2 className="w-full text-3xl font-semibold text-mainBlack text-center">
                     Pick an action:
                </h2>
                <div className="w-full justify-evenly flex flex-col laptop:flex-row mb-6 bg-white p-[20px] rounded-[7px] divide-y laptop:divide-x laptop:divide-y-0 divide-mainDark">
                    <Link href="/admin/create-album" className="w-full min-w-[150px] max-laptop:pb-20 flex flex-col justify-center items-center hover:text-mainOrange transition-all">
                        <IcRoundAlbum className="w-[60px] h-[60px]" />
                        <div>Create album</div>
                    </Link>
                    <Link href="/admin/upload-track" className="w-full min-w-[150px] max-laptop:p-20 flex flex-col justify-center items-center hover:text-mainOrange transition-all">
                        <BiSoundwave className="w-[60px] h-[60px]" />
                        <div>Upload track</div>
                    </Link>
                    <Link href="/admin/create-artist" className="w-full min-w-[150px] max-laptop:p-20 flex flex-col justify-center items-center hover:text-mainOrange transition-all">
                        <MingcuteMicrophoneLine className="w-[40px] h-[60px]" />
                        <div>Create artist</div>
                    </Link>
                    <Link href="/admin/create-genre" className="w-full min-w-[150px] max-laptop:pt-20 flex flex-col justify-center items-center hover:text-mainOrange transition-all">
                        <TablerHandRock className="w-[40px] h-[60px]" />
                        <div>Create genre</div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
