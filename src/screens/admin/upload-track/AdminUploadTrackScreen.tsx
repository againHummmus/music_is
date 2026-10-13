'use client';

import { useState } from 'react';
import HugeiconsUploadCircle01 from '~icons/hugeicons/upload-circle-01';
import { FileUploader } from 'react-drag-drop-files';
import { SuggestionInput } from '@/components/ui/SuggestionInput';
import { RoundButton } from '@/components/ui/buttons/RoundButton';
import { searchAlbums } from '@/actions/albumApi';
import { searchArtists } from '@/actions/artistApi';
import { searchGenres } from '@/actions/genreApi';
import { useTrackUploadForm } from '@/hooks/useTrackUploadForm';

interface ArtistOption {
  id: number | string;
  name?: string | null;
}

const fileTypes = ['MP3'];

export function AdminUploadTrackScreen() {
  const [selectedArtist, setSelectedArtist] = useState<ArtistOption | null>(
    null
  );
  const {
    file,
    setFile,
    name,
    setName,
    setLyrics,
    setGenre,
    setAlbum,
    isComplete,
    isUploading,
    upload,
  } = useTrackUploadForm({
    artistId: selectedArtist?.id,
    isAddedByUser: false,
    redirectUrl: '/admin',
  });

  return (
    <div className="flex h-full w-full flex-col items-center justify-start p-4 text-darkStormy/80">
      <h1 className="mb-8 text-center text-2xl font-bold text-orange-500 sm:text-3xl">
        Uploading track
      </h1>

      <div className="mb-6 flex w-full max-w-[550px] flex-col gap-6">
        <div className="flex flex-col items-center justify-center rounded-lg bg-white p-6">
          <h2 className="mb-4 w-full text-center text-xl font-semibold text-mainBlack">
            Add file
          </h2>
          <FileUploader handleChange={setFile} name="track" types={fileTypes}>
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

        <div className="flex flex-col justify-center gap-3 rounded-lg bg-white p-6">
          <h2 className="mb-4 w-full text-center text-xl font-semibold text-mainBlack">
            Basic info
          </h2>
          <input
            type="text"
            placeholder="Track name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mb-3 w-full rounded-[7px] border border-darkStormy/80 bg-darkStormy/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-mainOrange"
          />
          <SuggestionInput
            searchFn={searchGenres}
            placeholder="Genre..."
            typeName="Genre"
            onSelect={setGenre}
          />
          <SuggestionInput
            searchFn={searchArtists}
            placeholder="Artist..."
            typeName="Artist"
            onSelect={setSelectedArtist}
          />
          <SuggestionInput
            searchFn={searchAlbums}
            placeholder="Album..."
            typeName="Album"
            extraParams={selectedArtist ? { artistId: selectedArtist.id } : {}}
            onSelect={setAlbum}
          />
          <textarea
            placeholder="Add lyrics, if you want..."
            onChange={(e) => setLyrics(e.target.value)}
            className="mb-3 h-24 w-full resize-none rounded-[7px] border border-darkStormy/80 bg-darkStormy/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-mainOrange"
          />
        </div>
      </div>

      <RoundButton
        title={'OK'}
        loading={isUploading}
        onClick={upload}
        disabled={!isComplete}
      />
    </div>
  );
}
