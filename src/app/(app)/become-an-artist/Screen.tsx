'use client';

import React from 'react';
import { FileUploader } from 'react-drag-drop-files';
import AkarIconsArrowBack from '~icons/akar-icons/arrow-back';
import HugeiconsUploadCircle01 from '~icons/hugeicons/upload-circle-01';
import { RoundButton } from '@/components/shared/buttons/RoundButton';
import { useAuthStore } from '@/stores/authStore';
import { useBecomeArtist } from '@hooks/UseBecomeArtist';
import type { UserWithArtist } from '@/actions/types';

const FILE_TYPES = ['PNG', 'JPG', 'JPEG', 'WEBP'];

export default function BecomeAnArtistScreen({
  initialUser,
}: {
  initialUser?: UserWithArtist | null;
}) {
  const storeUser = useAuthStore((state) => state.user);
  const user = storeUser ?? initialUser;

  const {
    artistName,
    setArtistName,
    file,
    setFile,
    loading,
    preview,
    handleSubmit,
    canSubmit,
  } = useBecomeArtist(user?.id);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-4">
      <header className="text-center">
        <h1 className="text-2xl font-bold sm:text-3xl">
          <span className="text-orange-500">Becoming</span> an artist
        </h1>
        <p className="mt-2 text-sm sm:text-base">
          You only need a photo and a scenery name to become one!
        </p>
      </header>

      <main className="flex w-full max-w-md flex-col gap-6 rounded-lg bg-white p-6 shadow-sm">
        <section className="flex flex-col gap-2">
          <label className="text-base font-medium text-mainBlack/70">
            Add your most iconic picture:
          </label>
          <FileUploader handleChange={setFile} name="image" types={FILE_TYPES}>
            <div className="flex min-h-[100px] w-full cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-darkStormy/80 bg-darkStormy/10 p-4 transition-colors hover:bg-darkStormy/5">
              {file && preview ? (
                <div className="flex w-full flex-row items-center gap-4">
                  <img
                    src={preview}
                    alt="Preview"
                    className="h-24 w-24 rounded-md object-cover"
                  />
                  <div className="flex flex-col overflow-hidden">
                    <p className="truncate font-mono text-xs">{file.name}</p>
                    <span className="flex items-center gap-1 text-xs text-orange-500">
                      <AkarIconsArrowBack className="rotate-180" /> Change
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-darkStormy/60">
                  <HugeiconsUploadCircle01 className="text-2xl" />
                  <p className="text-center text-sm">
                    <span className="hidden sm:inline">drag-n-drop or </span>
                    select artwork
                  </p>
                </div>
              )}
            </div>
          </FileUploader>
        </section>

        <section className="flex flex-col gap-2">
          <label className="text-base font-medium text-mainBlack/70">
            What name do you want to be known by?
          </label>
          <input
            type="text"
            placeholder="Artist name"
            className="w-full rounded-lg border border-darkStormy/80 bg-darkStormy/10 px-3 py-2 outline-none transition-all focus:ring-2 focus:ring-orange-500"
            value={artistName}
            onChange={(e) => setArtistName(e.target.value)}
          />
        </section>
      </main>

      <RoundButton
        title="OK"
        loading={loading}
        disabled={!canSubmit}
        onClick={handleSubmit}
      />
    </div>
  );
}
