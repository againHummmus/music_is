'use client';

import { useStore } from '@/app/store';
import { FileUploader } from 'react-drag-drop-files';
import HugeiconsUploadCircle01 from '~icons/hugeicons/upload-circle-01?width=24px&height=24px';
import type { UserWithArtist } from '@/actions/types';
import { useSettings } from '@hooks/UseSettings';

const fileTypes = ['JPG', 'PNG', 'GIF'];

export default function SettingsScreen({
  initialUser,
}: {
  initialUser: UserWithArtist | null;
}) {
  const state = useStore();
  const storeUser = state.user;
  const user = storeUser ?? initialUser;

  const {
    username,
    setUsername,
    email,
    editingName,
    setEditingName,
    file,
    handleFileChange,
    saving,
    handleLogout,
    handleSave,
  } = useSettings(user);

  return (
    <div className="flex min-h-screen w-full flex-col gap-8 text-mainDark">
      <h1 className="text-3xl font-bold">Settings</h1>

      <section className="flex flex-col items-center rounded-lg bg-white p-6 text-darkStormy/80">
        <h2 className="mb-4 w-full text-center text-xl font-semibold text-mainBlack">
          {user?.avatar_url ? 'Change avatar' : 'Add avatar'}
        </h2>
        <FileUploader
          handleChange={handleFileChange}
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
        <div>
          <span className="text-sm text-gray-600">Email</span>
          <div className="font-medium">{email}</div>
        </div>
      </div>

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
          disabled={saving || (!editingName && !file)}
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
        <button
          className="rounded-[7px] bg-badRed px-6 py-2 font-medium text-white transition-all hover:bg-[#db3c3c]"
          onClick={handleLogout}
        >
          Log out
        </button>
      </div>
    </div>
  );
}
