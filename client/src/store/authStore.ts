import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AuthStore {
    isAccessToken: boolean;
    isRefreshToken: boolean;
    setTokenState: (
        accessToken: boolean | null,
        refreshToken: boolean | null
    ) => void;
    resetTokenState: () => void;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            isAccessToken: false,
            isRefreshToken: false,
            setTokenState: (accessToken, refreshToken) => {
                set({
                    isAccessToken: !!accessToken,
                    isRefreshToken: !!refreshToken,
                });
            },
            resetTokenState: () =>
                set({ isAccessToken: false, isRefreshToken: false }),
        }),
        {
            name: "auth-storage",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                isAccessToken: state.isAccessToken,
                isRefreshToken: state.isRefreshToken,
            }),
        }
    )
);
