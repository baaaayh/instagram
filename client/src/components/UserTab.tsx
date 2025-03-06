import { Dispatch } from "react";
type Action = { type: string };
import Feeds from "@/assets/images/icons/icon_tab_feeds.svg?react";
import Reels from "@/assets/images/icons/icon_tab_reels.svg?react";
import Tags from "@/assets/images/icons/icon_tab_tags.svg?react";
import { TabsProps } from "@/type";
import clsx from "clsx";
import styles from "@/assets/styles/UserTab.module.scss";

export default function UserTab({
    state,
    dispatch,
}: {
    state: TabsProps;
    dispatch: Dispatch<Action>;
}) {
    const { currentContents } = state;
    return (
        <div className={styles["user-tab"]}>
            <ul>
                <li>
                    <button
                        type="button"
                        className={clsx(
                            `${styles["user-tab__button"]} ${styles["user-tab__button--feed"]}`,
                            {
                                [styles["user-tab__button--active"]]:
                                    currentContents === "FEEDS",
                            }
                        )}
                        onClick={() => dispatch({ type: "DATA_FEED" })}
                    >
                        <Feeds />
                        <span>게시물</span>
                    </button>
                </li>
                <li>
                    <button
                        type="button"
                        className={clsx(
                            `${styles["user-tab__button"]} ${styles["user-tab__button--reels"]}`,
                            {
                                [styles["user-tab__button--active"]]:
                                    currentContents === "REELS",
                            }
                        )}
                        onClick={() => dispatch({ type: "DATA_REELS" })}
                    >
                        <Reels />
                        <span>릴스</span>
                    </button>
                </li>
                <li>
                    <button
                        type="button"
                        className={clsx(
                            `${styles["user-tab__button"]} ${styles["user-tab__button--tags"]}`,
                            {
                                [styles["user-tab__button--active"]]:
                                    currentContents === "TAGS",
                            }
                        )}
                        onClick={() => dispatch({ type: "DATA_TAGS" })}
                    >
                        <Tags />
                        <span>태그됨</span>
                    </button>
                </li>
            </ul>
        </div>
    );
}
