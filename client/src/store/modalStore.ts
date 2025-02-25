import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface ModalStore {
    isOpenPostModal: boolean;
    setOpenPostModal: () => void;
    setClosePostModal: () => void;
}

export const useModalStore = create<ModalStore>()(
    persist(
        (set) => ({
            isOpenPostModal: false,
            setOpenPostModal: () => set({ isOpenPostModal: true }),
            setClosePostModal: () => set({ isOpenPostModal: false }),
        }),
        {
            name: "modal-storage",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                isOpenPostModal: state.isOpenPostModal,
            }),
        }
    )
);
