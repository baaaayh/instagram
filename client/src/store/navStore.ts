import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface NavStore {
    isWideNav: boolean;
    isOpenNavSearch: boolean;
    isOpenMoreMenu: boolean;
    setOpenNavSearch: () => void;
    setCloseNavSearch: () => void;
    setToggleNavSearch: () => void;
    setOpenMoreMenu: () => void;
    setCloseMoreMenu: () => void;
    setToggleMoreMenu: () => void;
}

export const useNavStore = create<NavStore>()(
    persist(
        (set) => ({
            isWideNav: false,
            isOpenNavSearch: false,
            isOpenMoreMenu: false,
            setOpenNavSearch: () =>
                set({
                    isWideNav: true,
                    isOpenNavSearch: true,
                    isOpenMoreMenu: false,
                }),
            setCloseNavSearch: () =>
                set({ isWideNav: false, isOpenNavSearch: false }),
            setToggleNavSearch: () =>
                set((state) => ({
                    isWideNav: !state.isWideNav,
                    isOpenNavSearch: !state.isOpenNavSearch,
                    isOpenMoreMenu: false,
                })),
            setOpenMoreMenu: () => set({ isOpenMoreMenu: true }),
            setCloseMoreMenu: () => set({ isOpenMoreMenu: false }),
            setToggleMoreMenu: () =>
                set((state) => ({ isOpenMoreMenu: !state.isOpenMoreMenu })),
        }),
        {
            name: "nav-storage",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                isWideNav: state.isWideNav,
                isOpenNavSearch: state.isOpenNavSearch,
                isOpenMoreMenu: state.isOpenMoreMenu,
            }),
        }
    )
);
