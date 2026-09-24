'use client';

import React from 'react';
import { RoundButton } from '@/components/shared/buttons/RoundButton';
import { useAdminCreateGenre } from '@hooks/UseAdminCreateGenre';

export default function CreateGenreScreen() {
  const { genreName, setGenreName, loading, canSubmit, handleUpload } =
    useAdminCreateGenre();

  return (
    <div className="flex h-full w-full flex-col items-center justify-start p-4 text-darkStormy/80">
      <h1 className="mb-8 text-center text-2xl font-bold text-orange-500 sm:text-3xl">
        Creating a Genre
      </h1>

      <div className="mb-6 flex w-full max-w-[550px] flex-col gap-6">
        <div className="flex flex-col justify-center gap-3 rounded-lg bg-white p-6">
          <h2 className="mb-4 w-full text-center text-xl font-semibold text-mainBlack">
            Genre Info
          </h2>
          <input
            type="text"
            placeholder="Genre name..."
            value={genreName}
            onChange={(e) => setGenreName(e.target.value)}
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
