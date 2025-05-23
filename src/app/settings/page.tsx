"use client";
import { useState } from "react";
import { useStore } from "@/app/store";
import UserApi from "@/actions/userApi";
import { FileUploader } from "react-drag-drop-files";
import HugeiconsUploadCircle01 from "~icons/hugeicons/upload-circle-01?width=24px&height=24px";

const fileTypes = ["JPG", "PNG", "GIF"];

export default function SettingsPage() {
  const state = useStore();
  const user = state.user;
  const [username, setUsername] = useState(user?.username);
  const [email] = useState(user?.email);
  const [file, setFile] = useState<File | null>(null);
  const [editingName, setEditingName] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleLogout = async () => {
    await state.signOut();
  };

  const handleFileChange = (uploaded: File) => {
    setFile(uploaded);
  };

  const handleSave = async () => {
    if (!file && !editingName) {
      state.setModal({ isOpen: true, type: 'warning', message: 'Nothing to save' });
      return;
    }
    setSaving(true);
    try {
      await UserApi.updateUser({
        userId: user.id,
        file: file || undefined,
        newUsername: editingName ? username : undefined,
      });
      state.setModal({ isOpen: true, type: 'success', message: 'Profile saved!' });
      setEditingName(false);
      setFile(null);
    } catch (err: any) {
      console.error(err);
      state.setModal({ isOpen: true, type: 'error', message: 'Save failed' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col gap-8 bg-mainWhite text-mainDark">
      <h1 className="text-3xl font-bold">Settings</h1>

      {/* Аватар */}
      <section className="p-6 bg-white rounded-lg flex flex-col items-center text-darkStormy/80">
        <h2 className="text-xl font-semibold mb-4 text-mainBlack w-full text-center">
          {user?.avatar_url ? "Change avatar" : "Add avatar"}
        </h2>
        <FileUploader
          handleChange={handleFileChange}
          name="avatar"
          types={fileTypes}
        >
          <div className="w-full h-[50px] main:h-[100px] flex items-center justify-center gap-2 px-4 py-2 bg-darkStormy/10 border border-dashed border-darkStormy/80 hover:border-darkStormy hover:text-darkStormy rounded-[7px] transition-all">
            {file ? file.name : "Drag & drop or select file"}
            <HugeiconsUploadCircle01 />
          </div>
        </FileUploader>
      </section>

     <div className="flex justify-between items-center bg-white rounded p-4">
        <div>
          <span className="text-sm text-gray-600">Email</span>
          <div className="font-medium">{email}</div>
        </div>
      </div>

     <div className="flex justify-between items-center bg-white rounded p-4">
        <div className="flex-1">
          <span className="text-sm text-gray-600">Username</span>
          {editingName ? (
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-mainOrange"
            />
          ) : (
            <div className="font-medium">{username}</div>
          )}
        </div>
        <button
          className="ml-4 px-4 py-2 rounded-[7px] bg-darkStormy hover:bg-mainDark transition-all text-white"
          onClick={() => setEditingName((v) => !v)}
        >
          {editingName ? "Cancel" : "Edit"}
        </button>
      </div>

      <div className="flex gap-4">
        <button
          className="px-6 py-2 rounded-[7px] cursor-pointer font-medium bg-secondaryOrange hover:bg-mainOrange transition-all text-white disabled:opacity-50"
          onClick={handleSave}
          disabled={saving || (!editingName && !file)}
        >
          {saving ? "Saving..." : "Save"}
        </button>
        <button
          className="px-6 py-2 rounded-[7px] font-medium bg-badRed hover:bg-[#db3c3c] transition-all text-white"
          onClick={handleLogout}
        >
          Log out
        </button>
      </div>
    </div>
  );
}
