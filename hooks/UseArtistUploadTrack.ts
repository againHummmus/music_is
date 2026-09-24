import { useState } from 'react';
import { createTrack } from '@/actions/trackApi';
import { useUiStore } from '@/stores/uiStore';

interface SuggestionItem {
  id: number | string;
  name?: string | null;
}

export const useArtistUploadTrack = (artistId?: number | null) => {
  const [file, setFile] = useState<File | null>(null);
  const [trackName, setTrackName] = useState('');
  const [trackLyrics, setTrackLyrics] = useState('');
  const [trackGenre, setTrackGenre] = useState<SuggestionItem | null>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<SuggestionItem | null>(
    null
  );
  const [rightsConfirmed, setRightsConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const setModal = useUiStore((s) => s.setModal);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRightsConfirmed(e.target.checked);
  };

  const canSubmit = !!(
    file &&
    trackName &&
    trackGenre &&
    selectedAlbum &&
    rightsConfirmed
  );

  const handleUpload = async () => {
    if (!file || !trackName || !trackGenre || !selectedAlbum || !artistId)
      return;
    setLoading(true);
    try {
      await createTrack({
        genreId: trackGenre.id,
        artistId,
        albumId: selectedAlbum.id,
        name: trackName,
        lyrics: trackLyrics,
        file,
        isAddedByUser: true,
      });
      setModal({
        isOpen: true,
        type: 'success',
        message: 'Track uploaded!',
        redirectUrl: '/create',
      });
    } catch {
      setModal({
        isOpen: true,
        type: 'error',
        message: 'Error in uploading track :(',
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
    trackGenre,
    setTrackGenre,
    selectedAlbum,
    setSelectedAlbum,
    rightsConfirmed,
    handleCheckboxChange,
    loading,
    canSubmit,
    handleUpload,
  };
};
