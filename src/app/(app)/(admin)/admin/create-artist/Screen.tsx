'use client';

import React from 'react';
import HugeiconsUploadCircle01 from '~icons/hugeicons/upload-circle-01';
import { FileUploader } from 'react-drag-drop-files';
import { RoundButton } from '@/components/shared/buttons/RoundButton';
import { useAdminCreateArtist } from '@hooks/UseAdminCreateArtist';

const fileTypes = ['PNG', 'JPG', 'JPEG', 'WEBP'];

export default function CreateArtistScreen() {
  const {
    file,
    setFile,
    preview,
    artistName,
    setArtistName,
    loading,
    canSubmit,
    handleUpload,
  } = useAdminCreateArtist();

  return (
    <div className="flex h-full w-full flex-col items-center justify-start p-4 text-darkStormy/80">
      <h1 className="mb-8 text-center text-2xl font-bold text-orange-500 sm:text-3xl">
        Creating an artist
      </h1>

      <div className="mb-6 flex w-full max-w-[550px] flex-col gap-6">
        <div className="flex flex-col items-center justify-center rounded-lg bg-white p-6">
          <h2 className="mb-4 w-full text-center text-xl font-semibold text-mainBlack">
            Add artwork
          </h2>
          <FileUploader
            handleChange={setFile}
            name="artist-artwork"
            types={fileTypes}
          >
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

        <div className="flex flex-col justify-center gap-3 rounded-lg bg-white p-6">
          <h2 className="mb-4 w-full text-center text-xl font-semibold text-mainBlack">
            Basic info
          </h2>
          <input
            type="text"
            placeholder="Artist name..."
            value={artistName}
            onChange={(e) => setArtistName(e.target.value)}
            className="w-full rounded-[7px] border border-darkStormy/80 bg-darkStormy/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-mainOrange"
          />
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
