import { memo } from "react";
import { Link } from "react-router-dom";
import { CommentProps, UserPageProps } from "@/type";
import styles from "@/assets/styles/FeedComment.module.scss";

export default memo(function FeedComment({
    data,
    currentUser,
}: {
    data: CommentProps | string;
    currentUser: UserPageProps | null;
}) {
    return (
        <div className={styles["feed-comment"]}>
            <div className={styles["feed-comment__inner"]}>
                <div className={styles["feed-comment__user"]}>
                    <Link
                        to={`${
                            typeof data === "string"
                                ? currentUser?.user.nickname
                                : data.user_nickname
                        }`}
                    >
                        {typeof data === "string"
                            ? currentUser?.user.nickname
                            : data.user_nickname}
                    </Link>
                </div>
                <div className={styles["feed-comment__text"]}>
                    {typeof data === "string" ? data : data.comment}
                </div>
            </div>
        </div>
    );
});
