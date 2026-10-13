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
  setModal: (value: Modal) => void;
  closeModal: () => void;
}

export const useUiStore = create<UiState>()(
  devtools(
    (set) => ({
      modal: closedModal,

      setModal: (value) => set({ modal: value }),
      closeModal: () => set({ modal: closedModal }),
    }),
    { name: 'ui' }
  )
);
