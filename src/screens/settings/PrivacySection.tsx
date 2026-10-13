'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteMyAccount, exportMyData, setRecommendationsEnabled } from '@/actions/accountApi';
import { useAuthStore } from '@/stores/authStore';
import { usePlayerStore } from '@/stores/playerStore';
import { useLikesStore } from '@/stores/likesStore';

const DELETE_CONFIRMATION = 'DELETE';
const buttonClass =
  'rounded-[7px] bg-darkStormy px-4 py-2 text-white transition-all hover:bg-mainDark disabled:opacity-50';

export function PrivacySection({ recommendationsEnabled }: { recommendationsEnabled: boolean }) {
  const router = useRouter();
  const [recommendations, setRecommendations] = useState(recommendationsEnabled);
  const [recommendationsPending, setRecommendationsPending] = useState(false);
  const [exportPending, setExportPending] = useState(false);
  const [confirmation, setConfirmation] = useState('');
  const [deletePending, setDeletePending] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const handleRecommendationsChange = async (enabled: boolean) => {
    setRecommendationsPending(true);
    setStatus(null);
    try {
      await setRecommendationsEnabled(enabled);
      setRecommendations(enabled);
      router.refresh();
    } catch (err) {
      console.error(err);
      setStatus('Could not update the setting. Try again later.');
    } finally {
      setRecommendationsPending(false);
    }
  };

  const handleExport = async () => {
    setExportPending(true);
    setStatus(null);
    try {
      const data = await exportMyData();
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `musicis-data-${data.exportedAt.slice(0, 10)}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setStatus('Could not export your data. Try again later.');
    } finally {
      setExportPending(false);
    }
  };

  const handleDelete = async () => {
    if (confirmation !== DELETE_CONFIRMATION) return;
    setDeletePending(true);
    setStatus(null);
    try {
      await deleteMyAccount();
      useAuthStore.setState({ isAuth: false, user: undefined });
      usePlayerStore.getState().reset();
      useLikesStore.getState().reset();
      window.location.href = '/';
    } catch (err) {
      console.error(err);
      setStatus('Could not delete the account. Try again later.');
      setDeletePending(false);
    }
  };

  return (
    <section className="flex flex-col gap-4 rounded bg-white p-4">
      <h2 className="text-xl font-semibold text-mainBlack">Privacy</h2>

      <label className="flex items-start gap-2">
        <input
          type="checkbox"
          checked={recommendations}
          disabled={recommendationsPending}
          onChange={(e) => handleRecommendationsChange(e.target.checked)}
          className="mt-1 h-[15px] w-[15px] accent-mainOrange"
        />
        <span>
          <span className="font-medium">Personalized recommendations</span>
          <span className="block text-sm text-gray-600">
            Use the tracks you like to suggest people with similar taste. When turned off, your
            likes are not used for suggestions and you are not suggested to others.
          </span>
        </span>
      </label>

      <div className="flex flex-col gap-2">
        <span className="font-medium">Your data</span>
        <span className="text-sm text-gray-600">
          Download everything we store about you as a JSON file.
        </span>
        <button
          onClick={handleExport}
          disabled={exportPending}
          className={`${buttonClass} self-start`}>
          {exportPending ? 'Preparing...' : 'Download my data'}
        </button>
      </div>

      <div className="flex flex-col gap-2 rounded border border-badRed/40 p-4">
        <span className="font-medium text-badRed">Delete account</span>
        <span className="text-sm text-gray-600">
          Permanently deletes your profile, posts, likes, playlists and uploads. Your messages stay
          visible to the people you talked to, but without your name. Type {DELETE_CONFIRMATION} to
          confirm.
        </span>
        <input
          type="text"
          value={confirmation}
          onChange={(e) => setConfirmation(e.target.value)}
          placeholder={DELETE_CONFIRMATION}
          className="w-full rounded border px-2 py-1 focus:outline-none focus:ring-2 focus:ring-badRed"
        />
        <button
          onClick={handleDelete}
          disabled={confirmation !== DELETE_CONFIRMATION || deletePending}
          className="self-start rounded-[7px] bg-badRed px-4 py-2 text-white transition-all hover:bg-[#db3c3c] disabled:opacity-50">
          {deletePending ? 'Deleting...' : 'Delete my account'}
        </button>
      </div>

      {status && <p className="text-sm text-badRed">{status}</p>}
    </section>
  );
}
