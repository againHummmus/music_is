import type { TrackRow } from '@/actions/types';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface Modal {
  isOpen: boolean;
  type?: string;
  message?: string;
  redirectUrl?: string;
}

const closedModal: Modal = {
  isOpen: false,
  type: undefined,
  message: undefined,
  redirectUrl: undefined,
};

interface UiState {
  modal: Modal;
  chosenTrack: TrackRow | undefined;
  setModal: (value: Modal) => void;
  closeModal: () => void;
  setChosenTrack: (track: TrackRow | undefined) => void;
}

export const useUiStore = create<UiState>()(
  devtools(
    (set) => ({
      modal: closedModal,
      chosenTrack: undefined,

      setModal: (value) => set({ modal: value }),
      closeModal: () => set({ modal: closedModal }),
      setChosenTrack: (track) => set({ chosenTrack: track }),
    }),
    { name: 'ui' }
  )
);
