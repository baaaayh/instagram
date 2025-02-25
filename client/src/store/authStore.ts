import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AuthStore {
    userId: string;
    userNickName: string;
    isAccessToken: boolean;
    isRefreshToken: boolean;
    setUserId: (userId: string, nickName: string) => void;
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
            userNickName: "",
            isAccessToken: false,
            isRefreshToken: false,
            setUserId: (userId: string, userNickName: string) => {
                set({
                    userId: userId,
                    userNickName: userNickName,
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
                    userNickName: "",
                    isAccessToken: false,
                    isRefreshToken: false,
                }),
        }),
        {
            name: "auth-storage",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                userId: state.userId,
                userNickName: state.userNickName,
                isAccessToken: state.isAccessToken,
                isRefreshToken: state.isRefreshToken,
            }),
        }
    )
);
