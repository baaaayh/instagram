import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchStore } from "@/store/searchStore";
import { fetchSearchData } from "@/api/fetchSearchData";
import styles from "@/assets/styles/SearchComponent.module.scss";

export default function SearchComponent() {
    const { inputValue, setInputValue, setStateSearchModal } = useSearchStore();

    const { refetch } = useQuery({
        queryKey: ["searchData", inputValue],
        queryFn: () => fetchSearchData(inputValue),
        enabled: false,
    });

    useEffect(() => {
        if (inputValue.trim() !== "") {
            refetch();
        }
    }, [inputValue, refetch]);

    return (
        <div className={`search-component ${styles["search-component"]}`}>
            <h2>검색</h2>
            <div
                className={`search-component__input ${styles["search-component__input"]}`}
            >
                <input
                    type="text"
                    placeholder="검색"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onFocus={() => setStateSearchModal(true)}
                />
                <button type="button" onClick={() => setInputValue("")}>
                    <span>삭제</span>
                </button>
            </div>
        </div>
    );
}
