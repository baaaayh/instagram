import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AuthStore {
    userId: string;
    userNickName: string;
    userName: string;
    userProfileImage: string;
    userIntro: string;
    isAccessToken: boolean;
    isRefreshToken: boolean;
    setUser: (
        userId: string,
        nickName: string,
        userName: string,
        userProfileImage: string,
        userIntro: string
    ) => void;
    setTokenState: (
        accessToken: boolean | null,
        refreshToken: boolean | null
    ) => void;
    resetTokenState: () => void;
    logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            userId: "",
            userNickName: "",
            userName: "",
            userProfileImage: "",
            userIntro: "",
            isAccessToken: false,
            isRefreshToken: false,
            setUser: (
                userId: string,
                userNickName: string,
                userName: string,
                userProfileImage: string,
                userIntro: string
            ) => {
                set({
                    userId: userId,
                    userNickName: userNickName,
                    userName: userName,
                    userProfileImage: userProfileImage,
                    userIntro: userIntro,
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
                    userName: "",
                    userProfileImage: "",
                    userIntro: "",
                    isAccessToken: false,
                    isRefreshToken: false,
                }),
            logout: () => {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                set({ isAccessToken: false, isRefreshToken: false });
                set((state) => {
                    state.resetTokenState();
                    return {};
                });
            },
        }),
        {
            name: "auth-storage",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                userId: state.userId,
                userNickName: state.userNickName,
                userName: state.userName,
                userProfileImage: state.userProfileImage,
                userIntro: state.userIntro,
                isAccessToken: state.isAccessToken,
                isRefreshToken: state.isRefreshToken,
            }),
        }
    )
);
