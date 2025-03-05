import { useState, useCallback, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import SideNavSearchItem from "@/components/SideNavSearchItem";
import clsx from "clsx";
import styles from "@/assets/styles/SideNavSearch.module.scss";
import { SideNavSearchItemProps } from "@/type";

async function fetchSearchData(inputValue: string) {
    if (!inputValue) return [];

    try {
        const response = await axios.post("/api/search", {
            params: { searchValue: inputValue },
        });
        const data = response.data.searchData;
        return data;
    } catch (error) {
        console.error("Error fetching data:", error);
        return [];
    }
}

export default function SideNavSearch({ navState }: { navState: boolean }) {
    const [inputValue, setInputValue] = useState("");
    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleSearchInput = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setInputValue(e.target.value);
        },
        []
    );

    const {
        data: searchData,
        isLoading,
        isError,
        refetch,
    } = useQuery({
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
        <div
            className={clsx(styles["search"], {
                [styles["search--active"]]: navState,
            })}
        >
            <div className={styles["search__inner"]}>
                <div className={styles["search__header"]}>
                    <h2>검색</h2>
                    <div className={styles["search__input"]}>
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="검색"
                            value={inputValue}
                            onChange={handleSearchInput}
                        />
                        <button type="button" onClick={() => setInputValue("")}>
                            <span>삭제</span>
                        </button>
                    </div>
                </div>
                <div className={styles["history"]}>
                    <div className={styles["history__header"]}>
                        <h3>최근 검색 항목</h3>
                        <button type="button">
                            <span>모두 지우기</span>
                        </button>
                    </div>
                    <div className={styles["history__body"]}>
                        {isLoading && <p>검색 중...</p>}
                        {isError && <p>검색 오류 발생</p>}
                        {searchData ? (
                            searchData.length > 0 ? (
                                <ul>
                                    {searchData.map(
                                        (item: SideNavSearchItemProps) => (
                                            <SideNavSearchItem
                                                key={item.nickname}
                                                data={item}
                                            />
                                        )
                                    )}
                                </ul>
                            ) : (
                                <p>검색 결과가 없습니다.</p>
                            )
                        ) : (
                            <p>
                                <b>최근 검색 내역 없음.</b>
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
