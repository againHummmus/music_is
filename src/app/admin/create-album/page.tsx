'use client'

import React, { useState, useEffect } from "react";
import HugeiconsUploadCircle01 from "~icons/hugeicons/upload-circle-01";
import { useRouter } from "next/navigation"
import { FileUploader } from "react-drag-drop-files";
import AlbumApi from "@/actions/albumApi";
import ArtistApi from "@/actions/artistApi";
import { useStore } from "@/app/store";
import SuggestionInput from "@/components/shared/utils/ui/SuggestionsInput";
import userApi from "@/actions/userApi";

export default function CreateAlbumAdmin() {
  const fileTypes = ["PNG", "JPG", "JPEG", "WEBP"];

  const [file, setFile] = useState<any>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [albumName, setAlbumName] = useState("");
  const [albumYear, setAlbumYear] = useState("");
  const [selectedArtist, setSelectedArtist] = useState<any>(null);
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

  const handleUpload = async () => {
    if (!file) {
      console.error("Please select an image file");
      return;
    }
    if (!albumName || !albumYear || !selectedArtist) {
      console.error("Please fill in all required fields");
      return;
    }
    const yearNum = parseInt(albumYear);
    if (isNaN(yearNum)) {
      console.error("Please enter a valid year");
      return;
    }
    try {
      await AlbumApi.createAlbum({
        name: albumName,
        year: yearNum,
        artistId: selectedArtist.id,
        image_hash: file,
      });
      store.setModal({
        isOpen: true,
        type: "success",
        message: "Album created!",
        redirectUrl: "/admin",
      });
    } catch (error: any) {
      console.error("Error creating album:", error);
      store.setModal({
        isOpen: true,
        type: "error",
        message: "Error in creating Album",
        redirectUrl: "/admin",
      });
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-start p-4 bg-mainWhite text-darkStormy/80">
      <h1 className="text-2xl sm:text-3xl font-bold text-orange-500 mb-8 text-center">
        Creating an album
      </h1>

      <div className="w-full max-w-[550px] flex flex-col gap-6 mb-6">
        <div className="p-6 bg-white rounded-lg flex flex-col items-center justify-center">
          <h2 className="text-xl font-semibold mb-4 text-mainBlack w-full text-center">
            Add artwork
          </h2>
          <FileUploader handleChange={handleChange} name="album-artwork" types={fileTypes}>
            <div className="w-full min-h-[50px] main:min-h-[100px] flex flex-row items-center justify-center gap-[10px] p-2 bg-darkStormy/10 border border-dashed border-darkStormy/80 hover:border-darkStormy hover:text-darkStormy rounded-[7px] transition-all">
              {file ? (
                <div className="w-full flex flex-row items-center gap-4">
                  {preview && (
                    <img
                      src={preview}
                      alt={file.name}
                      className="w-[200px] h-[200px] object-cover rounded-[7px]"
                    />
                  )}
                  <div className="flex flex-col">
                    <p className="break-all">{file.name}</p>
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

        <div className="p-6 bg-white rounded-lg flex flex-col gap-3 justify-center">
          <h2 className="text-xl font-semibold mb-4 text-mainBlack w-full text-center">
            Basic info
          </h2>
          <input
            type="text"
            placeholder="Album name..."
            value={albumName}
            onChange={(e) => setAlbumName(e.target.value)}
            className="w-full mb-3 px-3 py-2 bg-darkStormy/10 border border-darkStormy/80 rounded-[7px] focus:outline-none focus:ring-2 focus:ring-mainOrange"
          />
          <input
            type="number"
            placeholder="Year..."
            value={albumYear}
            onChange={(e) => setAlbumYear(e.target.value)}
            className="w-full mb-3 px-3 py-2 bg-darkStormy/10 border border-darkStormy/80 rounded-[7px] focus:outline-none focus:ring-2 focus:ring-mainOrange"
          />

          <SuggestionInput
            searchFn={ArtistApi.searchArtists}
            placeholder="Artist..."
            typeName="Artist"
            onSelect={(artist) => setSelectedArtist(artist)}
          />
        </div>
      </div>

      <button
        onClick={handleUpload}
        disabled={!(file && albumName && albumYear && selectedArtist)}
        className={`p-4 rounded-full aspect-square ${file && albumName && albumYear && selectedArtist
          ? "bg-mainBlack hover:bg-mainOrange"
          : "bg-gray-400 cursor-not-allowed"
          } text-white transition-all`}
      >
        OK
      </button>
    </div>
  );
}
