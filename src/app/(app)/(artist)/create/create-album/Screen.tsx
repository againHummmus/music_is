'use client';

import React from 'react';
import HugeiconsUploadCircle01 from '~icons/hugeicons/upload-circle-01';
import { FileUploader } from 'react-drag-drop-files';
import AkarIconsArrowBack from '~icons/akar-icons/arrow-back';
import { useStore } from '@/app/store';
import { RoundButton } from '@/components/shared/buttons/RoundButton';
import type { UserWithArtist } from '@/actions/types';
import { useArtistCreateAlbum } from '@hooks/UseArtistCreateAlbum';

const fileTypes = ['PNG', 'JPG', 'JPEG', 'WEBP'];

export default function CreateAlbumScreen({
  initialUser,
}: {
  initialUser: UserWithArtist | null;
}) {
  const store = useStore((state) => state);
  const storeUser = store.user;
  const user = storeUser ?? initialUser;
  const artistId = user?.Artist?.id ?? null;

  const {
    file,
    setFile,
    preview,
    albumName,
    setAlbumName,
    loading,
    handleSubmit,
  } = useArtistCreateAlbum(artistId);

  return (
    <div className="flex h-full w-full flex-col items-center justify-start p-4 text-darkStormy/80">
      <h1 className="mb-8 text-center text-2xl font-bold text-orange-500 sm:text-3xl">
        Creating your album
      </h1>

      <div className="mb-6 flex w-full max-w-[550px] flex-col gap-6">
        <div className="flex flex-col items-center justify-center rounded-lg bg-white p-6">
          <h2 className="mb-4 w-full text-center text-xl font-semibold text-mainBlack">
            Add files
          </h2>
          <FileUploader handleChange={setFile} name="track" types={fileTypes}>
            <div className="flex min-h-[50px] w-full flex-row items-center justify-center gap-[10px] rounded-[7px] border border-dashed border-darkStormy/80 bg-darkStormy/10 p-2 transition-all hover:border-darkStormy hover:text-darkStormy main:min-h-[100px]">
              {file ? (
                <div className="flex w-full flex-row items-center gap-4">
                  {preview && (
                    <img
                      src={preview}
                      alt={file.name}
                      className="h-[200px] w-[200px] rounded-[7px] object-cover"
                    />
                  )}
                  <div className="flex flex-col">
                    <AkarIconsArrowBack className="h-[30px] w-[30px]" />
                    <p className="break-all">{file.name}</p>
                  </div>
                </div>
              ) : (
                <>
                  <p className="hidden main:block">
                    drag-n-drop or select artwork
                  </p>
                  <p className="block main:hidden">select artwork</p>
                  <HugeiconsUploadCircle01 className="min-h-[25px] min-w-[25px]" />
                </>
              )}
            </div>
          </FileUploader>
        </div>

        <div className="flex flex-col justify-center rounded-lg bg-white p-6">
          <h2 className="mb-4 w-full text-center text-xl font-semibold text-mainBlack">
            basic info
          </h2>
          <input
            type="text"
            placeholder="name..."
            value={albumName}
            onChange={(e) => setAlbumName(e.target.value)}
            className="mb-3 w-full rounded-[7px] border border-darkStormy/80 bg-darkStormy/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-mainOrange"
          />
        </div>
      </div>

      <RoundButton title={'OK'} loading={loading} onClick={handleSubmit} />
    </div>
  );
}
