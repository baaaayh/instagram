import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { FeedProps, UserPageProps } from "@/type";

interface ModalStore {
    isOpenPostModal: boolean;
    setOpenPostModal: () => void;
    setClosePostModal: () => void;
    isOpenAccountModal: boolean;
    setOpenAccountModal: () => void;
    setCloseAccountModal: () => void;
    isOpenFeedModal: boolean;
    feedData: FeedProps | null;
    currUserData: UserPageProps | null;
    setOpenFeedModal: (
        data: UserPageProps | null,
        feed: FeedProps | null
    ) => void;
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
            feedData: null,
            currUserData: null,
            setOpenFeedModal: (data, feed) =>
                set({
                    isOpenFeedModal: true,
                    currUserData: data,
                    feedData: feed,
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
                feedData: state.feedData,
                currUserData: state.currUserData,
            }),
        }
    )
);
