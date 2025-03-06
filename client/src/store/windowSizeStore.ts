import { useEffect } from "react";
import { create } from "zustand";
import { debounce } from "lodash";

interface WindowSizeState {
    width: number;
    setSize: (width: number) => void;
}

export const useWindowSizeStore = create<WindowSizeState>((set) => ({
    width: window.innerWidth,
    setSize: (width: number) => set({ width }),
}));

export const useWindowSize = () => {
    const setSize = useWindowSizeStore((state) => state.setSize);

    useEffect(() => {
        const handleResize = debounce(() => {
            setSize(window.innerWidth);
        }, 100);

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [setSize]);
};
