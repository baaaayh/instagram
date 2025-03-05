import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface NavStore {
    isOpenNavPanel: boolean;
    setOpenNavSearch: () => void;
    setCloseNavSearch: () => void;
    setToggleNavSearch: () => void;
}

export const useNavStore = create<NavStore>()(
    persist(
        (set) => ({
            isOpenNavPanel: false,
            setOpenNavSearch: () => set({ isOpenNavPanel: true }),
            setCloseNavSearch: () => set({ isOpenNavPanel: false }),
            setToggleNavSearch: () =>
                set((state) => ({ isOpenNavPanel: !state.isOpenNavPanel })), // ✅ 상태 기반으로 토글
        }),
        {
            name: "modal-storage",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                isOpenNavPanel: state.isOpenNavPanel,
            }),
        }
    )
);
