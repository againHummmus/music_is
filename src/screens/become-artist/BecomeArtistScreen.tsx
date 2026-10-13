'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileUploader } from 'react-drag-drop-files';
import AkarIconsArrowBack from '~icons/akar-icons/arrow-back';
import HugeiconsUploadCircle01 from '~icons/hugeicons/upload-circle-01';
import { RoundButton } from '@/components/ui/buttons/RoundButton';
import { becomeArtist } from '@/actions/artistApi';
import { useAuthStore } from '@/stores/authStore';
import { useFileWithPreview } from '@/hooks/useFileWithPreview';

const FILE_TYPES = ['PNG', 'JPG', 'JPEG', 'WEBP'];

export function BecomeArtistScreen() {
  const { file, setFile, preview } = useFileWithPreview();
  const [artistName, setArtistName] = useState('');
  const [loading, setLoading] = useState(false);
  const update = useAuthStore((s) => s.update);
  const router = useRouter();

  const canSubmit = Boolean(artistName.trim() && file && !loading);

  const handleSubmit = async () => {
    if (!artistName.trim() || !file || loading) return;
    try {
      setLoading(true);
      await becomeArtist({ name: artistName, image: file });
      update();
      router.push('/create');
    } catch (error) {
      console.error('Failed to create artist:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-4">
      <header className="text-center">
        <h1 className="text-center text-2xl font-bold sm:text-3xl">
          <span className="text-orange-500">Becoming</span> an artist
        </h1>
        <p className="mt-2 text-center text-sm sm:text-base">
          You only need a photo and a scenery name to become one!
        </p>
      </header>

      <div className="flex w-full max-w-md flex-col gap-6 rounded-lg bg-white p-6 shadow-sm">
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
      </div>

      <RoundButton
        title="OK"
        loading={loading}
        disabled={!canSubmit}
        onClick={handleSubmit}
      />
    </div>
  );
}
