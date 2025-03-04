import { useState, useCallback, useRef } from "react";
import clsx from "clsx";
import styles from "@/assets/styles/SideNavSearch.module.scss";
export default function SideNavSearch({ navState }: { navState: boolean }) {
    const [inputValue, setInputValue] = useState("");
    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleSearchInput = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setInputValue(e.target.value);
        },
        []
    );

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
                        <button type="button">
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
                    <div className={styles["search__history"]}>
                        <ul>
                            <li>
                                <div className={styles["account"]}>
                                    <div className={styles["account__inner"]}>
                                        <div
                                            className={
                                                styles["account__figure"]
                                            }
                                        ></div>
                                        <div
                                            className={styles["account__info"]}
                                        >
                                            <div
                                                className={
                                                    styles["account__nickname"]
                                                }
                                            ></div>
                                            <div
                                                className={
                                                    styles["account__intro"]
                                                }
                                            ></div>
                                        </div>
                                        <div
                                            className={
                                                styles["account__remove"]
                                            }
                                        >
                                            <button type="button"></button>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
