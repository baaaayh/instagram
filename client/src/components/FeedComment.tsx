import { memo } from "react";
import { Link } from "react-router-dom";
import ProfileIcon from "@/components/ProfileIcon";
import { CommentProps } from "@/type";
import styles from "@/assets/styles/FeedComment.module.scss";

export default memo(function FeedComment({
    data,
    user,
}: {
    data: CommentProps | string;
    user: string;
}) {
    return (
        <div className={styles["feed-comment"]}>
            <div className={styles["feed-comment__inner"]}>
                <div className={styles["feed-comment__user"]}>
                    <div className={styles["feed-comment__figure"]}>
                        <Link to={`/${user}`}>
                            {typeof data !== "string" && data.profile_image ? (
                                <img src={data.profile_image} alt="" />
                            ) : (
                                <ProfileIcon width={32} height={32} />
                            )}
                        </Link>
                    </div>
                </div>
                <div className={styles["feed-comment__text"]}>
                    <Link to={`/${user}`}>{user}</Link>
                    <div className={styles["feed-comment__row"]}>
                        {typeof data === "string" ? data : data.comment}
                    </div>
                </div>
            </div>
        </div>
    );
});
