import { useState, useEffect, useMemo } from 'react';
import { createArtist } from '@/actions/artistApi';
import { useUiStore } from '@/stores/uiStore';

export const useAdminCreateArtist = () => {
  const [file, setFile] = useState<File | null>(null);
  const [artistName, setArtistName] = useState('');
  const [loading, setLoading] = useState(false);
  const setModal = useUiStore((s) => s.setModal);

  const preview = useMemo(
    () => (file ? URL.createObjectURL(file) : null),
    [file]
  );

  useEffect(() => {
    if (!preview) return;
    return () => URL.revokeObjectURL(preview);
  }, [preview]);

  const canSubmit = !!(file && artistName);

  const handleUpload = async () => {
    if (!artistName || !file) return;
    try {
      setLoading(true);
      await createArtist({ name: artistName, image: file });
      setModal({
        isOpen: true,
        type: 'success',
        message: 'Artist created!',
        redirectUrl: '/admin',
      });
    } catch {
      setModal({
        isOpen: true,
        type: 'error',
        message: 'Error in creating Artist',
        redirectUrl: '/admin',
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    file,
    setFile,
    preview,
    artistName,
    setArtistName,
    loading,
    canSubmit,
    handleUpload,
  };
};
