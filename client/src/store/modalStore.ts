import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface ModalStore {
    isOpenPostModal: boolean;
    setOpenPostModal: () => void;
    setClosePostModal: () => void;
    isOpenAccountModal: boolean;
    setOpenAccountModal: () => void;
    setCloseAccountModal: () => void;
    isOpenFeedModal: boolean;
    currentFeedId: string | null;
    setOpenFeedModal: (feedId: string) => void;
    setCloseFeedModal: () => void;
}

export const useModalStore = create<ModalStore>()(
    persist(
        (set) => ({
            isOpenPostModal: false,
            setOpenPostModal: () => set({ isOpenPostModal: true }),
            setClosePostModal: () => set({ isOpenPostModal: false }),
            isOpenAccountModal: false,
            setOpenAccountModal: () => set({ isOpenAccountModal: true }),
            setCloseAccountModal: () => set({ isOpenAccountModal: false }),
            isOpenFeedModal: false,
            currentFeedId: null,
            setOpenFeedModal: (feedId) =>
                set({
                    currentFeedId: feedId,
                    isOpenFeedModal: true,
                }),
            setCloseFeedModal: () => set({ isOpenFeedModal: false }),
        }),
        {
            name: "modal-storage",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                isOpenPostModal: state.isOpenPostModal,
                isOpenAccountModal: state.isOpenAccountModal,
                isOpenFeedModal: state.isOpenFeedModal,
                currentFeedId: state.currentFeedId,
            }),
        }
    )
);
