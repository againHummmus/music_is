'use client';

import { useState } from 'react';
import { RoundButton } from '@/components/ui/buttons/RoundButton';
import { createGenre } from '@/actions/genreApi';
import { useUiStore } from '@/stores/uiStore';

export function AdminCreateGenreScreen() {
  const [genreName, setGenreName] = useState('');
  const [loading, setLoading] = useState(false);
  const setModal = useUiStore((s) => s.setModal);

  const canSubmit = genreName.trim().length > 0;

  const handleUpload = async () => {
    if (!canSubmit) return;
    try {
      setLoading(true);
      await createGenre({ name: genreName });
      setModal({
        isOpen: true,
        type: 'success',
        message: 'Genre created!',
        redirectUrl: '/admin',
      });
    } catch {
      setModal({
        isOpen: true,
        type: 'error',
        message: 'Error in creating Genre',
        redirectUrl: '/admin',
      });
    } finally {
      setLoading(false);
    }
  };

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
