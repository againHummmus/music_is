import { useState } from 'react';
import { createGenre } from '@/actions/genreApi';
import { useStore } from '@/app/store';

export const useAdminCreateGenre = () => {
  const [genreName, setGenreName] = useState('');
  const [loading, setLoading] = useState(false);
  const store = useStore();

  const canSubmit = genreName.trim().length > 0;

  const handleUpload = async () => {
    if (!genreName.trim()) return;
    try {
      setLoading(true);
      await createGenre({ name: genreName });
      store.setModal({
        isOpen: true,
        type: 'success',
        message: 'Genre created!',
        redirectUrl: '/admin',
      });
    } catch {
      store.setModal({
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
