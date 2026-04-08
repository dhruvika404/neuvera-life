import { create } from "zustand";

export type ModalId = "new-campaign" | "add-lead" | "icp-switch" | "agent-config" | null;

interface ModalsState {
  activeModal: ModalId;
  payload: unknown;
}

interface ModalsActions {
  openModal: (modal: NonNullable<ModalId>, payload?: unknown) => void;
  closeModal: () => void;
}

export const useModalsStore = create<ModalsState & ModalsActions>((set) => ({
  activeModal: null,
  payload: null,

  openModal: (modal, payload = null) => set({ activeModal: modal, payload }),

  closeModal: () => set({ activeModal: null, payload: null }),
}));
