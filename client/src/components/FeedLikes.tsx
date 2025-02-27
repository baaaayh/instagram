import { memo } from "react";
import styles from "@/assets/styles/FeedFooter.module.scss";

export default memo(function FeedLikes({ likes }: { likes: number }) {
    return (
        <div className={styles["feed-footer__likes"]}>
            <strong>좋아요</strong> {likes ? likes : 0} 개
        </div>
    );
});
