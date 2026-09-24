import { useState, useEffect, useMemo } from 'react';
import { createAlbum } from '@/actions/albumApi';
import { useStore } from '@/app/store';

interface SuggestionItem {
  id: number | string;
  name?: string | null;
}

export const useAdminCreateAlbum = () => {
  const [file, setFile] = useState<File | null>(null);
  const [albumName, setAlbumName] = useState('');
  const [albumYear, setAlbumYear] = useState('');
  const [selectedArtist, setSelectedArtist] = useState<SuggestionItem | null>(
    null
  );
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

  const canSubmit = !!(file && albumName && albumYear && selectedArtist);

  const handleUpload = async () => {
    if (!file || !albumName || !albumYear || !selectedArtist) return;
    const yearNum = parseInt(albumYear);
    if (isNaN(yearNum)) return;
    try {
      setLoading(true);
      await createAlbum({
        name: albumName,
        year: yearNum,
        artistId: Number(selectedArtist.id),
        image_hash: file,
      });
      store.setModal({
        isOpen: true,
        type: 'success',
        message: 'Album created!',
        redirectUrl: '/admin',
      });
    } catch {
      store.setModal({
        isOpen: true,
        type: 'error',
        message: 'Error in creating Album',
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
    albumName,
    setAlbumName,
    albumYear,
    setAlbumYear,
    selectedArtist,
    setSelectedArtist,
    loading,
    canSubmit,
    handleUpload,
  };
};
