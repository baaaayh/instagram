import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AuthStore {
    userId: string;
    isAccessToken: boolean;
    isRefreshToken: boolean;
    setUserId: (userId: string) => void;
    setTokenState: (
        accessToken: boolean | null,
        refreshToken: boolean | null
    ) => void;
    resetTokenState: () => void;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            userId: "",
            isAccessToken: false,
            isRefreshToken: false,
            setUserId: (userId: string) => {
                set({
                    userId: userId,
                });
            },
            setTokenState: (accessToken, refreshToken) => {
                set({
                    isAccessToken: !!accessToken,
                    isRefreshToken: !!refreshToken,
                });
            },
            resetTokenState: () =>
                set({
                    userId: "",
                    isAccessToken: false,
                    isRefreshToken: false,
                }),
        }),
        {
            name: "auth-storage",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                userId: state.userId,
                isAccessToken: state.isAccessToken,
                isRefreshToken: state.isRefreshToken,
            }),
        }
    )
);
