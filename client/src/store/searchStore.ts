import { create } from "zustand";

interface SearchState {
    inputValue: string;
    isSearchModal: boolean;
    setInputValue: (value: string) => void;
    setStateSearchModal: (value: boolean) => void;
}

export const useSearchStore = create<SearchState>((set) => ({
    inputValue: "",
    isSearchModal: false,
    setInputValue: (value) => set({ inputValue: value }),
    setStateSearchModal: (value: boolean) => set({ isSearchModal: value }),
}));
