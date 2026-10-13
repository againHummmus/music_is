import { useState } from 'react';
import { createTrack } from '@/actions/trackApi';
import { useUiStore } from '@/stores/uiStore';

interface SuggestionItem {
  id: number | string;
  name?: string | null;
}

interface UseTrackUploadFormOptions {
  artistId: number | string | null | undefined;
  isAddedByUser: boolean;
  redirectUrl: string;
}

export function useTrackUploadForm({
  artistId,
  isAddedByUser,
  redirectUrl,
}: UseTrackUploadFormOptions) {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [lyrics, setLyrics] = useState('');
  const [genre, setGenre] = useState<SuggestionItem | null>(null);
  const [album, setAlbum] = useState<SuggestionItem | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const setModal = useUiStore((s) => s.setModal);

  const isComplete = Boolean(file && name && genre && album && artistId);

  const upload = async () => {
    if (!file || !name || !genre || !album || !artistId) return;
    setIsUploading(true);
    try {
      await createTrack({
        genreId: genre.id,
        artistId,
        albumId: album.id,
        name,
        lyrics,
        file,
        isAddedByUser,
      });
      setModal({
        isOpen: true,
        type: 'success',
        message: 'Track uploaded!',
        redirectUrl,
      });
    } catch {
      setModal({
        isOpen: true,
        type: 'error',
        message: 'Error uploading track :(',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return {
    file,
    setFile,
    name,
    setName,
    setLyrics,
    setGenre,
    setAlbum,
    isComplete,
    isUploading,
    upload,
  };
}
