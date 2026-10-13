'use client';

import { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useUiStore } from '@/stores/uiStore';
import { updateUser } from '@/actions/userApi';
import { withUploadedFile } from '@/lib/supabase/uploadFromBrowser';
import { describeError } from '@/lib/utils/describeError';
import { FileUploader } from 'react-drag-drop-files';
import HugeiconsUploadCircle01 from '~icons/hugeicons/upload-circle-01?width=24px&height=24px';
import type { UserWithArtist } from '@/actions/types';
import { AccountSecuritySection } from './AccountSecuritySection';
import { PrivacySection } from './PrivacySection';

const fileTypes = ['JPG', 'JPEG', 'PNG', 'GIF', 'WEBP'];
const MAX_AVATAR_BYTES = 10 * 1024 * 1024;

export function SettingsScreen({
  initialUser,
}: {
  initialUser: UserWithArtist | null;
}) {
  const storeUser = useAuthStore((s) => s.user);
  const user = storeUser ?? initialUser;

  const signOut = useAuthStore((s) => s.signOut);
  const setUser = useAuthStore((s) => s.setUser);
  const setModal = useUiStore((s) => s.setModal);
  const [username, setUsername] = useState(user?.username ?? '');
  const [editingName, setEditingName] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const canSave = !saving && (editingName || Boolean(file));

  const handleSave = async () => {
    if (!file && !editingName) {
      setModal({ isOpen: true, type: 'warning', message: 'Nothing to save' });
      return;
    }
    if (file && file.size > MAX_AVATAR_BYTES) {
      setModal({
        isOpen: true,
        type: 'error',
        message: 'The image is too large. Please pick one under 10 MB.',
      });
      return;
    }
    setSaving(true);
    const newUsername = editingName ? username : undefined;
    try {
      const updated = file
        ? await withUploadedFile('img', file, (avatarHash) =>
            updateUser({ avatarHash, newUsername })
          )
        : await updateUser({ newUsername });
      setUser(updated);
      setModal({ isOpen: true, type: 'success', message: 'Profile saved!' });
      setEditingName(false);
      setFile(null);
    } catch (err) {
      console.error(err);
      setModal({
        isOpen: true,
        type: 'error',
        message: `Save failed: ${describeError(err)}`,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col gap-8 text-mainDark">
      <h1 className="text-3xl font-bold">Settings</h1>

      <section className="flex flex-col items-center rounded-lg bg-white p-6 text-darkStormy/80">
        <h2 className="mb-4 w-full text-center text-xl font-semibold text-mainBlack">
          {user?.avatar_url ? 'Change avatar' : 'Add avatar'}
        </h2>
        <FileUploader
          handleChange={setFile}
          name="avatar"
          types={fileTypes}
        >
          <div className="flex h-[50px] w-full items-center justify-center gap-2 rounded-[7px] border border-dashed border-darkStormy/80 bg-darkStormy/10 px-4 py-2 transition-all hover:border-darkStormy hover:text-darkStormy main:h-[100px]">
            {file ? file.name : 'Drag & drop or select file'}
            <HugeiconsUploadCircle01 />
          </div>
        </FileUploader>
      </section>

      <div className="flex items-center justify-between rounded bg-white p-4">
        <div className="flex-1">
          <span className="text-sm text-gray-600">Username</span>
          {editingName ? (
            <input
              type="text"
              value={username ?? ''}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded border px-2 py-1 focus:outline-none focus:ring-2 focus:ring-mainOrange"
            />
          ) : (
            <div className="font-medium">{username}</div>
          )}
        </div>
        <button
          className="ml-4 rounded-[7px] bg-darkStormy px-4 py-2 text-white transition-all hover:bg-mainDark"
          onClick={() => setEditingName((v) => !v)}
        >
          {editingName ? 'Cancel' : 'Edit'}
        </button>
      </div>

      <div className="flex gap-4">
        <button
          className="cursor-pointer rounded-[7px] bg-secondaryOrange px-6 py-2 font-medium text-white transition-all hover:bg-mainOrange disabled:opacity-50"
          onClick={handleSave}
          disabled={!canSave}
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
        <button
          className="rounded-[7px] bg-badRed px-6 py-2 font-medium text-white transition-all hover:bg-[#db3c3c]"
          onClick={signOut}
        >
          Log out
        </button>
      </div>

      <AccountSecuritySection currentEmail={user?.email} />
      <PrivacySection
        recommendationsEnabled={user?.recommendations_enabled ?? true}
      />
    </div>
  );
}
