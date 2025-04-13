'use client';

import React, { useState, useEffect } from "react";
import HugeiconsUploadCircle01 from "~icons/hugeicons/upload-circle-01";
import { FileUploader } from "react-drag-drop-files";
import AlbumApi from "@/actions/albumApi";
import ArtistApi from "@/actions/artistApi";
import TrackApi from "@/actions/trackApi";
import { useStore } from "@/app/store";
import genreApi from "@/actions/genreApi";
import SuggestionInput from "@/components/shared/utils/ui/SuggestionsInput";
import userApi from "@/actions/userApi";
import { useRouter } from "next/navigation";

export default function AdminUploadTrack() {
  const fileTypes = ["MP3"];

  const [file, setFile] = useState<any>(null);
  const [trackName, setTrackName] = useState("");
  const [trackLyrics, setTrackLyrics] = useState("");

  const [selectedGenre, setSelectedGenre] = useState<any>(null);
  const [selectedArtist, setSelectedArtist] = useState<any>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<any>(null);

  const store = useStore((state) => state);
  const router = useRouter();

  useEffect(() => {
      (async () => {
          const user = await userApi.getUser(store.user.id);
          if (user?.role !== 'admin') {
              router.push("/");
              store.setModal({ isOpen: true, type: 'warning', message: 'You must be an admin to visit this page!' });
          }
      })()
  }, [])

  const handleChange = (file: any) => {
    setFile(file);
  };

  useEffect(() => {
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select an image file");
      return;
    }
    if (!trackName || !selectedGenre || !selectedArtist || !selectedAlbum) {
      alert("Please fill in all required fields");
      return;
    }
    try {
      await TrackApi.createTrack({
        genreId: selectedGenre.id,
        artistId: selectedArtist.id,
        albumId: selectedAlbum.id,
        name: trackName,
        lyrics: trackLyrics,
        file: file,
      });
      store.setModal({
        isOpen: true,
        type: "success",
        message: "Track uploaded successfully!",
        redirectUrl: "/admin",
      });
    } catch (error: any) {
      console.error("Error creating track:", error);
      store.setModal({
        isOpen: true,
        type: "error",
        message: "Error uploading track",
        redirectUrl: "/admin",
      });
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-start p-4 bg-mainWhite text-darkStormy/80">
      <h1 className="text-2xl sm:text-3xl font-bold text-orange-500 mb-8 text-center">
        Uploading your track (Admin Panel)
      </h1>

      <div className="w-full max-w-[550px] flex flex-col gap-6 mb-6">
        <div className="p-6 bg-white rounded-lg flex flex-col items-center justify-center">
          <h2 className="text-xl font-semibold mb-4 text-mainBlack w-full text-center">
            Add file
          </h2>
          <FileUploader handleChange={handleChange} name="track" types={fileTypes}>
            <div className="w-full h-[50px] main:h-[100px] flex flex-row items-center justify-center gap-[10px] px-4 py-2 bg-darkStormy/10 border border-dashed border-darkStormy/80 hover:border-darkStormy hover:text-darkStormy rounded-[7px] transition-all">
              {file ? (
                <div>{file.name}</div>
              ) : (
                <>
                  <p className="hidden main:block">drag-n-drop or select</p>
                  <p className="block main:hidden">select</p>
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
            placeholder="Track name..."
            value={trackName}
            onChange={(e) => setTrackName(e.target.value)}
            className="w-full mb-3 px-3 py-2 bg-darkStormy/10 border border-darkStormy/80 rounded-[7px] focus:outline-none focus:ring-2 focus:ring-mainOrange"
          />
          <SuggestionInput
            searchFn={genreApi.searchGenres}
            placeholder="Genre..."
            typeName="Genre"
            onSelect={(genre) => setSelectedGenre(genre)}
          />
          <SuggestionInput
            searchFn={ArtistApi.searchArtists}
            placeholder="Artist..."
            typeName="Artist"
            onSelect={(artist) => setSelectedArtist(artist)}
          />
          <SuggestionInput
            searchFn={AlbumApi.searchAlbums}
            placeholder="Album..."
            typeName="Album"
            extraParams={selectedArtist ? { artistId: selectedArtist.id } : {}}
            onSelect={(album) => setSelectedAlbum(album)}
          />
          <textarea
            placeholder="Add lyrics, if you want..."
            onChange={(e) => setTrackLyrics(e.target.value)}
            className="w-full h-24 mb-3 px-3 py-2 bg-darkStormy/10 border border-darkStormy/80 rounded-[7px] focus:outline-none focus:ring-2 focus:ring-mainOrange resize-none"
          />
        </div>
      </div>

      <button
        onClick={handleUpload}
        disabled={!(file && selectedArtist && selectedGenre && selectedAlbum && trackName)}
        className={`p-4 rounded-full aspect-square ${file && selectedArtist && selectedGenre && selectedAlbum && trackName
            ? "bg-mainBlack hover:bg-mainOrange"
            : "bg-gray-400 cursor-not-allowed"
          } text-white transition-all`}
      >
        OK
      </button>
    </div>
  );
}
