import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { UserDataProps } from "@/type";

interface HistoryStore {
    history: Array<UserDataProps>;
    setHistory: (data: UserDataProps) => void;
    removeHistory: (nickName: string) => void;
    resetHistory: () => void;
}

export const useHistoryStore = create<HistoryStore>()(
    persist(
        (set) => ({
            history: [],
            setHistory: (data: UserDataProps) =>
                set((state) => {
                    // 같은 nickname이 있는지 확인
                    const exists = state.history.some(
                        (item) => item.nickname === data.nickname
                    );
                    if (exists) {
                        return state; // 이미 존재하면 상태를 변경하지 않음
                    }
                    return { history: [...state.history, data] }; // 존재하지 않으면 추가
                }),
            removeHistory: (nickName: string) =>
                set((state) => ({
                    history: state.history.filter(
                        (item) => nickName !== item.nickname
                    ),
                })),
            resetHistory: () => set({ history: [] }),
        }),
        {
            name: "history-storage",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                history: state.history,
            }),
        }
    )
);
