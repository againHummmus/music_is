'use client'

import React, { useEffect, useState } from "react";
import GenreApi from "@/actions/genreApi";
import { useStore } from "@/app/store";
import userApi from "@/actions/userApi";
import { useRouter } from "next/navigation";
import { RoundButton } from "@/components/shared/buttons/RoundButton";

export default function CreateGenreAdmin() {
    const [genreName, setGenreName] = useState("");
    const [loading, setLoading] = useState(false);
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

    const handleUpload = async () => {
        if (!genreName.trim()) {
            console.error("Please provide a genre name");
            return;
        }
        try {
            setLoading(true)
            await GenreApi.createGenre({ name: genreName });
            store.setModal({
                isOpen: true,
                type: "success",
                message: "Genre created!",
                redirectUrl: "/admin",
            });
            setLoading(false)
        } catch (error: any) {
            console.error("Error creating genre:", error);
            store.setModal({
                isOpen: true,
                type: "error",
                message: "Error in creating Genre",
                redirectUrl: "/admin",
            });
            setLoading(false)
        }
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-start p-4 bg-mainWhite text-darkStormy/80">
            <h1 className="text-2xl sm:text-3xl font-bold text-orange-500 mb-8 text-center">
                Creating a Genre
            </h1>

            <div className="w-full max-w-[550px] flex flex-col gap-6 mb-6">
                <div className="p-6 bg-white rounded-lg flex flex-col gap-3 justify-center">
                    <h2 className="text-xl font-semibold mb-4 text-mainBlack w-full text-center">
                        Genre Info
                    </h2>
                    <input
                        type="text"
                        placeholder="Genre name..."
                        value={genreName}
                        onChange={(e) => setGenreName(e.target.value)}
                        className="w-full px-3 py-2 bg-darkStormy/10 border border-darkStormy/80 rounded-[7px] focus:outline-none focus:ring-2 focus:ring-mainOrange"
                    />
                </div>
            </div>

            <RoundButton title={"OK"} loading={loading} onClick={handleUpload} disabled={!genreName.trim()} />
        </div>
    );
}
