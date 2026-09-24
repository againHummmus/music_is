import { useState } from 'react';
import { createGenre } from '@/actions/genreApi';
import { useUiStore } from '@/stores/uiStore';

export const useAdminCreateGenre = () => {
  const [genreName, setGenreName] = useState('');
  const [loading, setLoading] = useState(false);
  const setModal = useUiStore((s) => s.setModal);

  const canSubmit = genreName.trim().length > 0;

  const handleUpload = async () => {
    if (!genreName.trim()) return;
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

  return { genreName, setGenreName, loading, canSubmit, handleUpload };
};
