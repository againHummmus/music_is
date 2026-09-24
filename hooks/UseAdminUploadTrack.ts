import { useState } from 'react';
import { createTrack } from '@/actions/trackApi';
import { useUiStore } from '@/stores/uiStore';

interface SuggestionItem {
  id: number | string;
  name?: string | null;
}

export const useAdminUploadTrack = () => {
  const [file, setFile] = useState<File | null>(null);
  const [trackName, setTrackName] = useState('');
  const [trackLyrics, setTrackLyrics] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<SuggestionItem | null>(
    null
  );
  const [selectedArtist, setSelectedArtist] = useState<SuggestionItem | null>(
    null
  );
  const [selectedAlbum, setSelectedAlbum] = useState<SuggestionItem | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const setModal = useUiStore((s) => s.setModal);

  const canSubmit = !!(
    file &&
    selectedArtist &&
    selectedGenre &&
    selectedAlbum &&
    trackName
  );

  const handleUpload = async () => {
    if (
      !file ||
      !trackName ||
      !selectedGenre ||
      !selectedArtist ||
      !selectedAlbum
    )
      return;
    try {
      setLoading(true);
      await createTrack({
        genreId: selectedGenre.id,
        artistId: selectedArtist.id,
        albumId: selectedAlbum.id,
        name: trackName,
        lyrics: trackLyrics,
        file,
        isAddedByUser: false,
      });
      setModal({
        isOpen: true,
        type: 'success',
        message: 'Track uploaded successfully!',
        redirectUrl: '/admin',
      });
    } catch {
      setModal({
        isOpen: true,
        type: 'error',
        message: 'Error uploading track',
        redirectUrl: '/admin',
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    file,
    setFile,
    trackName,
    setTrackName,
    trackLyrics,
    setTrackLyrics,
    selectedGenre,
    setSelectedGenre,
    selectedArtist,
    setSelectedArtist,
    selectedAlbum,
    setSelectedAlbum,
    loading,
    canSubmit,
    handleUpload,
  };
};
