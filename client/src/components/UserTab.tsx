import { Dispatch } from "react";
type Action = { type: string };
import Feeds from "@/assets/images/icons/icon_tab_feeds.svg?react";
import Reels from "@/assets/images/icons/icon_tab_reels.svg?react";
import Tags from "@/assets/images/icons/icon_tab_tags.svg?react";
import styles from "@/assets/styles/UserTab.module.scss";

export default function UserTab({ dispatch }: { dispatch: Dispatch<Action> }) {
    return (
        <div className={styles["user-tab"]}>
            <ul>
                <li>
                    <button
                        type="button"
                        className={`${styles["user-tab__button"]} ${styles["user-tab__button--feed"]}`}
                        onClick={() => dispatch({ type: "DATA_FEED" })}
                    >
                        <Feeds />
                        <span>게시물</span>
                    </button>
                </li>
                <li>
                    <button
                        type="button"
                        className={`${styles["user-tab__button"]} ${styles["user-tab__button--reels"]}`}
                        onClick={() => dispatch({ type: "DATA_REELS" })}
                    >
                        <Reels />
                        <span>릴스</span>
                    </button>
                </li>
                <li>
                    <button
                        type="button"
                        className={`${styles["user-tab__button"]} ${styles["user-tab__button--tags"]}`}
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
