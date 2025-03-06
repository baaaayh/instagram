import { useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from "@/assets/images/common/small_logo.svg?react";
import SearchComponent from "@/components/SearchComponent";
import { fetchSearchData } from "@/api/fetchSearchData";
import { useQuery } from "@tanstack/react-query";
import UserComponent from "@/components/UserComponent";
import { useSearchStore } from "@/store/searchStore";
import { useHistoryStore } from "@/store/historyStore";
import { UserDataProps } from "@/type";
import styles from "@/assets/styles/CommonHeader.module.scss";

export default function CommonHeader() {
    const { inputValue, isSearchModal, setStateSearchModal } = useSearchStore();
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

    console.log(isLoading, isError);

    useEffect(() => {
        function checkParentElement(e: MouseEvent) {
            if (e.target instanceof HTMLElement) {
                if (
                    e.target.closest(".search-component") ||
                    e.target.closest(".header__content")
                ) {
                    setStateSearchModal(true);
                } else {
                    setStateSearchModal(false);
                }
            }
        }

        document.addEventListener("click", checkParentElement);

        return () => {
            document.removeEventListener("click", checkParentElement);
        };
    }, [setStateSearchModal]);

    return (
        <header className={styles["header"]}>
            <div className={styles["header__inner"]}>
                <h1 className={styles["header__logo"]}>
                    <Link to={"/"}>
                        <Logo />
                    </Link>
                </h1>
                <div className={styles["header__utils"]}>
                    <SearchComponent />
                </div>
            </div>
            {(inputValue.trim() !== "" || isSearchModal) && (
                <div className={`header__content ${styles["header__content"]}`}>
                    {searchData ? (
                        searchData.length > 0 ? (
                            <ul>
                                {searchData.map((user: UserDataProps) => (
                                    <UserComponent
                                        key={user.nickname}
                                        data={user}
                                        isFollowButton={false}
                                        isDeleteButton={true}
                                    />
                                ))}
                            </ul>
                        ) : (
                            <p>검색 결과가 없습니다.</p>
                        )
                    ) : (
                        <>
                            <div className={styles["header__title"]}>
                                <h3>최근 검색 항목</h3>
                                <button type="button" onClick={resetHistory}>
                                    <span>모두 지우기</span>
                                </button>
                            </div>
                            {history.length > 0 ? (
                                history.map((user: UserDataProps) => (
                                    <UserComponent
                                        key={user.nickname}
                                        data={user}
                                        isFollowButton={false}
                                        isDeleteButton={true}
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
            )}
        </header>
    );
}
