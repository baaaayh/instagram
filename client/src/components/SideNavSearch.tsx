import clsx from "clsx";
import { useSearchStore } from "@/store/searchStore";
import { useQuery } from "@tanstack/react-query";
import { fetchSearchData } from "@/api/fetchSearchData";
import { useHistoryStore } from "@/store/historyStore";
import SideNavSearchItem from "@/components/SideNavSearchItem";
import SearchComponent from "@/components/SearchComponent";
import styles from "@/assets/styles/SideNavSearch.module.scss";
import { UserDataProps } from "@/type";

export default function SideNavSearch({ navState }: { navState: boolean }) {
    const { inputValue } = useSearchStore();
    const { history, resetHistory } = useHistoryStore();

    const {
        data: searchData,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["searchData", inputValue],
        queryFn: () => fetchSearchData(inputValue),
        enabled: !!inputValue.trim(),
    });

    return (
        <div
            className={clsx(styles["search"], {
                [styles["search--active"]]: navState,
            })}
        >
            <div className={styles["search__inner"]}>
                <SearchComponent />
                <div className={styles["history"]}>
                    <div className={styles["history__body"]}>
                        {isLoading && <p>검색 중...</p>}
                        {isError && <p>검색 오류 발생</p>}
                        {searchData ? (
                            searchData.length > 0 ? (
                                <ul>
                                    {searchData.map((item: UserDataProps) => (
                                        <SideNavSearchItem
                                            key={item.nickname}
                                            data={item}
                                        />
                                    ))}
                                </ul>
                            ) : (
                                <p>검색 결과가 없습니다.</p>
                            )
                        ) : (
                            <>
                                <div className={styles["history__header"]}>
                                    <h3>최근 검색 항목</h3>
                                    <button
                                        type="button"
                                        onClick={resetHistory}
                                    >
                                        <span>모두 지우기</span>
                                    </button>
                                </div>
                                {history.length > 0 ? (
                                    history.map((item: UserDataProps) => (
                                        <SideNavSearchItem
                                            key={item.nickname}
                                            data={item}
                                        />
                                    ))
                                ) : (
                                    <p>
                                        <b>최근 검색 내역 없음.</b>
                                    </p>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
