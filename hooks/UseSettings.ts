import { useState } from 'react';
import { useStore } from '@/app/store';
import { updateUser } from '@/actions/userApi';
import type { UserWithArtist } from '@/actions/types';

export const useSettings = (user: UserWithArtist | null | undefined) => {
  const state = useStore();
  const [username, setUsername] = useState(user?.username ?? '');
  const [editingName, setEditingName] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const handleFileChange = (uploaded: File) => {
    setFile(uploaded);
  };

  const handleLogout = async () => {
    await state.signOut();
  };

  const handleSave = async () => {
    if (!file && !editingName) {
      state.setModal({
        isOpen: true,
        type: 'warning',
        message: 'Nothing to save',
      });
      return;
    }
    if (!user?.id) return;
    setSaving(true);
    try {
      await updateUser({
        file: file ?? undefined,
        newUsername: editingName ? username : undefined,
      });
      state.setModal({
        isOpen: true,
        type: 'success',
        message: 'Profile saved!',
      });
      setEditingName(false);
      setFile(null);
    } catch (err) {
      console.error(err);
      state.setModal({ isOpen: true, type: 'error', message: 'Save failed' });
    } finally {
      setSaving(false);
    }
  };

  const canSave = !saving && (editingName || !!file);

  return {
    username,
    setUsername,
    email: user?.email,
    editingName,
    setEditingName,
    file,
    handleFileChange,
    saving,
    canSave,
    handleLogout,
    handleSave,
  };
};
