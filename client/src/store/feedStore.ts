import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { FeedProps } from "@/type";

interface FeedStore {
    feedInfoData: FeedProps | null;
    isLike: boolean;
    likeCount: number;
    setFeedData: (feedData: FeedProps | null) => void;
    setLike: (isLiked: boolean) => void;
    setLikeCount: (count: number) => void;
}

export const useFeedStore = create<FeedStore>()(
    persist(
        (set) => ({
            feedInfoData: null,
            isLike: false,
            likeCount: 0,
            setFeedData: (feedData) =>
                set({
                    feedInfoData: feedData,
                    isLike: feedData?.is_liked ?? false,
                    likeCount: feedData?.like_count ?? 0,
                }),
            setLike: (isLiked) => set({ isLike: isLiked }),
            setLikeCount: (count) => set({ likeCount: count }),
        }),
        {
            name: "feed-storage",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                feedInfoData: state.feedInfoData,
                isLike: state.isLike,
                likeCount: state.likeCount,
            }),
        }
    )
);
