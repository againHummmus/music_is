"use client";

import ArtistApi from "@/actions/artistApi";
import React, { useEffect, useState } from "react";
import { useStore } from "../store";
import { FileUploader } from "react-drag-drop-files";
import AkarIconsArrowBack from '~icons/akar-icons/arrow-back';
import HugeiconsUploadCircle01 from '~icons/hugeicons/upload-circle-01';
import { useRouter } from "next/navigation";

export default function CreateArtist() {
    const store = useStore((state) => state);
    const user = store.user;
    const [artistName, setArtistName] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const fileTypes = ["PNG", "JPG", "JPEG", "WEBP"];
    const [preview, setPreview] = useState<any>(null);
    const router = useRouter();

    const handleChange = (file: any) => {
        setFile(file);
    };

    useEffect(() => {
        if (!file) {
            setPreview(null);
            return;
        }
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [file]);

    const handleSubmit = async () => {
        if (!artistName) {
            console.error("Введите имя артиста");
            return;
        }
        if (!file) {
            console.error("Выберите файл изображения");
            return;
        }
        try {
            const response = await ArtistApi.createArtist({
                name: artistName,
                userId: user?.id,
                image: file,
            });
            store.update()
            router.push('/create')
        } catch (error: any) {
            console.error("Error creating artist:", error);
            console.error(error?.response?.data?.message);
        }
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-4">
            <h1 className="text-2xl sm:text-3xl font-bold">
                <span className="text-orange-500">Becoming</span> an artist
            </h1>
            <p className="text-center text-sm sm:text-base">
                You only need a photo and a scenery name to become one!
            </p>

            <div className="bg-white w-full max-w-md rounded-lg p-6 flex flex-col gap-4 items-center">
                <div className='flex flex-col w-full gap-1'>
                    <p className="w-full text-base text-mainBlack/70">Add your most iconic picture:</p>
                    <FileUploader handleChange={handleChange} name="track" types={fileTypes}>
                        <div className="w-full min-h-[50px] main:min-h-[100px] flex flex-row items-center justify-center gap-[10px] p-2 bg-darkStormy/10 border border-dashed border-darkStormy/80 hover:border-darkStormy hover:text-darkStormy rounded-[7px] transition-all">
                            {file ? (
                                <div className="w-full flex flex-row items-center gap-4">
                                    {preview && (
                                        <img src={preview} alt={file.name} className="w-[200px] h-[200px] object-cover rounded-[7px]" />
                                    )}
                                    <div className="flex flex-col">
                                        <AkarIconsArrowBack className="w-[30px] h-[30px]" />
                                        <p>{file.name}</p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <p className="hidden main:block">drag-n-drop or select artwork</p>
                                    <p className="block main:hidden">select artwork</p>
                                    <HugeiconsUploadCircle01 className="min-w-[25px] min-h-[25px]" />
                                </>
                            )}
                        </div>
                    </FileUploader>
                </div>

                <div className='flex flex-col w-full gap-1'>
                    <p className="w-full text-base text-mainBlack/70">What name do you want to be known by?</p>
                    <input
                        type="text"
                        placeholder="name"
                        className="w-full mb-3 px-3 py-2 bg-darkStormy/10 border border-darkStormy/80 rounded-[7px] focus:outline-none focus:ring-2 focus:ring-mainOrange"
                        value={artistName}
                        onChange={(e) => setArtistName(e.target.value)}
                    />
                </div>
            </div>

            <button onClick={handleSubmit} className="p-4 rounded-full aspect-square bg-mainBlack text-white hover:bg-mainOrange transition-all">
                OK
            </button>
        </div>
    );
}
