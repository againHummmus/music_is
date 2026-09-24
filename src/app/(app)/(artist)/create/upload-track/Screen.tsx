'use client';

import React from 'react';
import HugeiconsUploadCircle01 from '~icons/hugeicons/upload-circle-01';
import { FileUploader } from 'react-drag-drop-files';


import { useAuthStore } from '@/stores/authStore';
import SuggestionInput from '@/components/shared/utils/ui/SuggestionsInput';
import { RoundButton } from '@/components/shared/buttons/RoundButton';
import { searchAlbums } from '@/actions/albumApi';
import { searchGenres } from '@/actions/genreApi';
import type { UserWithArtist } from '@/actions/types';
import { useArtistUploadTrack } from '@hooks/UseArtistUploadTrack';

const fileTypes = ['MP3'];

export default function UploadTrackScreen({
  initialUser,
}: {
  initialUser: UserWithArtist | null;
}) {
  const storeUser = useAuthStore((s) => s.user);
  const user = storeUser ?? initialUser;
  const artistId = user?.Artist?.id ?? null;

  const {
    file,
    setFile,
    trackName,
    setTrackName,
    trackLyrics,
    setTrackLyrics,
    trackGenre,
    setTrackGenre,
    selectedAlbum,
    setSelectedAlbum,
    rightsConfirmed,
    handleCheckboxChange,
    loading,
    canSubmit,
    handleUpload,
  } = useArtistUploadTrack(artistId);

  return (
    <div className="flex h-full flex-col items-center justify-start p-4">
      <h1 className="mb-8 text-center text-2xl font-bold text-orange-500 sm:text-3xl">
        Uploading your track
      </h1>

      <div className="mb-6 flex w-full max-w-[550px] flex-col gap-6">
        <div className="flex flex-col items-center justify-center rounded-lg bg-white p-6 text-darkStormy/80">
          <h2 className="mb-4 w-full text-center text-xl font-semibold text-mainBlack">
            Add files
          </h2>
          <FileUploader
            handleChange={setFile}
            name="track-input"
            types={fileTypes}
          >
            <div className="flex h-[50px] w-full flex-row items-center justify-center gap-[10px] rounded-[7px] border border-dashed border-darkStormy/80 bg-darkStormy/10 px-4 py-2 transition-all hover:border-darkStormy hover:text-darkStormy main:h-[100px]">
              {file ? (
                <div>{file.name}</div>
              ) : (
                <>
                  <p className="hidden main:block">drag-n-drop or select</p>
                  <p className="block main:hidden">select</p>
                  <HugeiconsUploadCircle01 className="min-h-[25px] min-w-[25px]" />
                </>
              )}
            </div>
          </FileUploader>
        </div>

        <div className="flex flex-col justify-center gap-3 rounded-lg bg-white p-6 text-mainBlack">
          <h2 className="mb-4 w-full text-center text-xl font-semibold text-mainBlack">
            Basic info
          </h2>
          <input
            onChange={(e) => setTrackName(e.target.value)}
            type="text"
            placeholder="name..."
            className="w-full rounded-[7px] border border-darkStormy/80 bg-darkStormy/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-mainOrange"
          />

          <SuggestionInput
            searchFn={searchGenres}
            placeholder="genre..."
            typeName="Genre"
            onSelect={(genre) => setTrackGenre(genre)}
          />

          <SuggestionInput
            searchFn={searchAlbums}
            placeholder="album..."
            typeName="Album"
            extraParams={{ artistId: artistId ?? undefined }}
            onSelect={(album) => setSelectedAlbum(album)}
          />

          <textarea
            onChange={(e) => setTrackLyrics(e.target.value)}
            placeholder="add lyrics, if you want..."
            className="mb-3 h-24 w-full resize-none rounded-[7px] border border-darkStormy/80 bg-darkStormy/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-mainOrange"
          />

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="rightsConfirmation"
              className="h-[15px] w-[15px] accent-mainOrange"
              checked={rightsConfirmed}
              onChange={handleCheckboxChange}
            />
            <label
              htmlFor="rightsConfirmation"
              className="text-sm text-darkStormy/80"
            >
              I confirm that I have the rights to upload this track
            </label>
          </div>
        </div>
      </div>
      <RoundButton
        title={'OK'}
        loading={loading}
        onClick={handleUpload}
        disabled={!canSubmit}
      />
    </div>
  );
}
