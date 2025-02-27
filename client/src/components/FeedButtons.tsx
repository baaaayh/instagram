import { memo } from "react";
import clsx from "clsx";
import Like from "@/assets/images/icons/icon_heart.svg?react";
import LikeOn from "@/assets/images/icons/icon_heart_on.svg?react";
import Comment from "@/assets/images/icons/icon_comment.svg?react";
import Message from "@/assets/images/icons/icon_message.svg?react";
import Save from "@/assets/images/icons/icon_save.svg?react";
import styles from "@/assets/styles/FeedButtons.module.scss";

export default memo(function FeedButtons({
    handleLike,
    isLike,
}: {
    handleLike: () => void;
    isLike: boolean;
}) {
    return (
        <div className={styles["feed-buttons"]}>
            <div className={styles["feed-buttons__inner"]}>
                <div className={styles["feed-buttons__left"]}>
                    <ul>
                        <li>
                            <button
                                type="button"
                                className={clsx(
                                    `${styles["button"]} ${styles["button-like"]}`,
                                    {
                                        [styles["button-like--active"]]: isLike,
                                    }
                                )}
                                onClick={handleLike}
                            >
                                <span>
                                    {isLike ? <LikeOn /> : <Like />}
                                    LIKE
                                </span>
                            </button>
                        </li>
                        <li>
                            <button
                                type="button"
                                className={clsx(
                                    `${styles["button"]} ${styles["button-comment"]}`
                                )}
                            >
                                <span>
                                    <Comment />
                                    COMMENT
                                </span>
                            </button>
                        </li>
                        <li>
                            <button
                                type="button"
                                className={clsx(
                                    `${styles["button"]} ${styles["button-messgae"]}`
                                )}
                            >
                                <span>
                                    <Message />
                                    MESSAGE
                                </span>
                            </button>
                        </li>
                    </ul>
                </div>
                <div className={styles["feed-buttons__right"]}>
                    <button
                        type="button"
                        className={clsx(
                            `${styles["button"]} ${styles["button-save"]}`
                        )}
                    >
                        <span>
                            <Save /> SAVE
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
});
