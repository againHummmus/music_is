"use client"

import React, { useState, useEffect } from "react";
import HugeiconsUploadCircle01 from '~icons/hugeicons/upload-circle-01';
import { FileUploader } from "react-drag-drop-files";
import AkarIconsArrowBack from '~icons/akar-icons/arrow-back';
import { useStore } from "@/app/store";
import AlbumApi from "@/actions/albumApi";
import userApi from "@/actions/userApi";
import { useRouter } from "next/navigation";
import { RoundButton } from "@/components/shared/buttons/RoundButton";

export default function CreateAlbum() {
  const fileTypes = ["PNG", "JPG", "JPEG", "WEBP"];
  const [file, setFile] = useState<any>(null);
  const [preview, setPreview] = useState<any>(null);
  const [albumName, setAlbumName] = useState("");
  const [loading, setLoading] = useState(false);
  const store = useStore((state) => state);
  const user = store.user;
  const artistId = user?.Artist?.id;
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const user = await userApi.getMe();
      if (user?.app_role !== 'artist') {
        router.push("/");
        store.setModal({ isOpen: true, type: 'warning', message: 'You must be an artist to visit this page!' });
      }
    })()
  }, [])

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
    try {
      setLoading(true)
      if (!albumName) {
        console.error("Введите название альбома");
        return;
      }
      if (!file) {
        console.error("Выберите изображение для альбома");
        return;
      }
      const year = new Date().getFullYear();
      await AlbumApi.createAlbum({
        name: albumName,
        year: year,
        artistId: artistId,
        image_hash: file,
      });
      store.setModal({isOpen: true, type: 'success', message: 'Album created!', redirectUrl: '/create'})
      setLoading(false)
    } catch (error: any) {
      console.error("Error creating album:", error);
      store.setModal({isOpen: true, type: 'error', message: 'Error in creating Album', redirectUrl: '/create'})
      setLoading(false)
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-start p-4 bg-mainWhite text-darkStormy/80">
      <h1 className="text-2xl sm:text-3xl font-bold text-orange-500 mb-8 text-center">
        Creating your album
      </h1>

      <div className="w-full max-w-[550px] flex flex-col gap-6 mb-6">
        <div className="p-6 bg-white rounded-lg flex flex-col items-center justify-center">
          <h2 className="text-xl font-semibold mb-4 text-mainBlack w-full text-center">Add files</h2>
          <FileUploader handleChange={handleChange} name="track" types={fileTypes}>
            <div className="w-full min-h-[50px] main:min-h-[100px] flex flex-row items-center justify-center gap-[10px] p-2 bg-darkStormy/10 border border-dashed border-darkStormy/80 hover:border-darkStormy hover:text-darkStormy rounded-[7px] transition-all">
              {file ? (
                <div className="w-full flex flex-row items-center gap-4">
                  {preview && (
                    <img src={preview} alt={file.name} className="w-[200px] h-[200px] object-cover rounded-[7px]" />
                  )}
                  <div className="flex flex-col">
                    <AkarIconsArrowBack className="w-[30px] h-[30px]"/>
                    <p className='break-all'>{file.name}</p>
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

        <div className="p-6 bg-white rounded-lg flex flex-col justify-center">
          <h2 className="text-xl font-semibold mb-4 text-mainBlack w-full text-center">basic info</h2>
          <input
            type="text"
            placeholder="name..."
            value={albumName}
            onChange={(e) => setAlbumName(e.target.value)}
            className="w-full mb-3 px-3 py-2 bg-darkStormy/10 border border-darkStormy/80 rounded-[7px] focus:outline-none focus:ring-2 focus:ring-mainOrange"
          />
        </div>
      </div>

      <RoundButton title={"OK"} loading={loading} onClick={handleSubmit} />
    </div>
  );
}
