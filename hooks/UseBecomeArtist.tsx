import { useState, useEffect, useMemo } from 'react';
import { becomeArtist } from '@/actions/artistApi';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

export const useBecomeArtist = (userId?: string | number) => {
  const [artistName, setArtistName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const update = useAuthStore((s) => s.update);
  const router = useRouter();

  const preview = useMemo(
    () => (file ? URL.createObjectURL(file) : null),
    [file]
  );

  useEffect(() => {
    if (!preview) return;
    return () => URL.revokeObjectURL(preview);
  }, [preview]);

  const canSubmit = artistName.trim() && file && !loading;

  const handleSubmit = async () => {
    if (!canSubmit) return;

    try {
      setLoading(true);
      await becomeArtist({
        name: artistName,
        image: file,
      });
      update();
      router.push('/create');
    } catch (error) {
      console.error('Failed to create artist:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    artistName,
    setArtistName,
    file,
    setFile,
    loading,
    preview,
    handleSubmit,
    canSubmit,
  };
};
