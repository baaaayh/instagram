import { memo } from "react";
import { Link } from "react-router-dom";
import { CommentProps } from "@/type";
import styles from "@/assets/styles/FeedComment.module.scss";

export default memo(function FeedComment({
    data,
    currentUser,
}: {
    data: CommentProps | string;
    currentUser: string;
}) {
    return (
        <div className={styles["feed-comment"]}>
            <div className={styles["feed-comment__inner"]}>
                <div className={styles["feed-comment__user"]}>
                    <Link to={`/${currentUser}`}>{currentUser}</Link>
                </div>
                <div className={styles["feed-comment__text"]}>
                    {typeof data === "string" ? data : data.comment}
                </div>
            </div>
        </div>
    );
});
