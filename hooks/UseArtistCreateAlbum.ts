import { useState, useEffect, useMemo } from 'react';
import { createAlbum } from '@/actions/albumApi';
import { useStore } from '@/app/store';

export const useArtistCreateAlbum = (artistId?: number | null) => {
  const [file, setFile] = useState<File | null>(null);
  const [albumName, setAlbumName] = useState('');
  const [loading, setLoading] = useState(false);
  const store = useStore();

  const preview = useMemo(
    () => (file ? URL.createObjectURL(file) : null),
    [file]
  );

  useEffect(() => {
    if (!preview) return;
    return () => URL.revokeObjectURL(preview);
  }, [preview]);

  const canSubmit = !!(file && albumName);

  const handleSubmit = async () => {
    if (!albumName || !file) return;
    try {
      setLoading(true);
      const year = new Date().getFullYear();
      await createAlbum({
        name: albumName,
        year,
        artistId: artistId ?? null,
        image_hash: file,
      });
      store.setModal({
        isOpen: true,
        type: 'success',
        message: 'Album created!',
        redirectUrl: '/create',
      });
    } catch {
      store.setModal({
        isOpen: true,
        type: 'error',
        message: 'Error in creating Album',
        redirectUrl: '/create',
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    file,
    setFile,
    preview,
    albumName,
    setAlbumName,
    loading,
    canSubmit,
    handleSubmit,
  };
};
