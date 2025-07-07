'use client'

import React, { useState, useEffect } from "react";
import HugeiconsUploadCircle01 from "~icons/hugeicons/upload-circle-01";
import { FileUploader } from "react-drag-drop-files";
import GenreApi from "@/actions/genreApi";
import AlbumApi from "@/actions/albumApi";
import TrackApi from "@/actions/trackApi";
import { useStore } from "@/app/store";
import SuggestionInput from "@/components/shared/utils/ui/SuggestionsInput";
import userApi from "@/actions/userApi";
import { useRouter } from "next/navigation";
import { RoundButton } from "@/components/shared/buttons/RoundButton";

export default function UploadTrack() {
  const fileTypes = ["MP3"];
  
  const [file, setFile] = useState<any>(null);
  const [trackName, setTrackName] = useState("");
  const [trackLyrics, setTrackLyrics] = useState("");
  const [loading, setLoading] = useState(false);

  const [trackGenre, setTrackGenre] = useState<any>();
  const [selectedAlbum, setSelectedAlbum] = useState<any>();

  const [rightsConfirmed, setRightsConfirmed] = useState(false);

  const store = useStore((state) => state);
  const user = store.user;
  const artistId = user?.Artist?.id;
  const router = useRouter();
  
    useEffect(() => {
        (async () => {
            const user = await userApi.getMe();
            if (user?.app_role !== 'artist') {
                router.push("/");
                store.setModal({isOpen: true, type: 'warning', message: 'You must be an artist to visit this page!'});
            }
        })()
    }, [])

  const handleChange = (file: any) => {
    setFile(file);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRightsConfirmed(e.target.checked);
  };

  useEffect(() => {
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const handleUpload = async () => {
    setLoading(true)
    if (!file) {
      console.error("Please select a file");
      return;
    }
    if (!trackName || !trackGenre || !selectedAlbum || !artistId) {
      console.error("Please fill in all required fields");
      return;
    }
    try {
      await TrackApi.createTrack({
        genreId: trackGenre.id,
        artistId: artistId,
        albumId: selectedAlbum.id,
        name: trackName,
        lyrics: trackLyrics,
        file: file,
        isAddedByUser: true
      })
      store.setModal({
        isOpen: true,
        type: "success",
        message: "Track uploaded!",
        redirectUrl: "/create",
      });
      setLoading(false)
    } catch (error) {
      store.setModal({
        isOpen: true,
        type: "error",
        message: "Error in uploading track :(",
        redirectUrl: "/create",
      });
      setLoading(false)
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-start p-4">
      <h1 className="text-2xl sm:text-3xl font-bold text-orange-500 mb-8 text-center">
        Uploading your track
      </h1>

      <div className="w-full max-w-[550px] flex flex-col gap-6 mb-6">
        <div className="p-6 bg-white rounded-lg flex flex-col items-center justify-center text-darkStormy/80">
          <h2 className="text-xl font-semibold mb-4 text-mainBlack w-full text-center">
            Add files
          </h2>
          <FileUploader handleChange={handleChange} name="track-input" types={fileTypes}>
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

        <div className="p-6 bg-white rounded-lg flex flex-col gap-3 justify-center text-mainBlack">
          <h2 className="text-xl font-semibold mb-4 text-mainBlack w-full text-center">
            Basic info
          </h2>
          <input
            onChange={(e) => setTrackName(e.target.value)}
            type="text"
            placeholder="name..."
            className="w-full px-3 py-2 bg-darkStormy/10 border border-darkStormy/80 rounded-[7px] focus:outline-none focus:ring-2 focus:ring-mainOrange"
          />
          
          <SuggestionInput
            searchFn={GenreApi.searchGenres}
            placeholder="genre..."
            typeName="Genre"
            onSelect={(genre) => setTrackGenre(genre)}
          />

          <SuggestionInput
            searchFn={AlbumApi.searchAlbums}
            placeholder="album..."
            typeName="Album"
            extraParams={{ artistId: artistId }}
            onSelect={(album) => setSelectedAlbum(album)}
          />

          <textarea
            onChange={(e) => setTrackLyrics(e.target.value)}
            placeholder="add lyrics, if you want..."
            className="w-full h-24 mb-3 px-3 py-2 bg-darkStormy/10 border border-darkStormy/80 rounded-[7px] focus:outline-none focus:ring-2 focus:ring-mainOrange resize-none"
          />

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="rightsConfirmation"
              className="w-[15px] h-[15px] accent-mainOrange"
              checked={rightsConfirmed}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="rightsConfirmation" className="text-sm text-darkStormy/80">
              I confirm that I have the rights to upload this track
            </label>
          </div>
        </div>
      </div>

      <RoundButton title={"OK"} loading={loading} onClick={handleUpload} disabled={!rightsConfirmed} />
    </div>
  );
}
