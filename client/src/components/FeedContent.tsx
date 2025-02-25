import { memo } from "react";
import styles from "@/assets/styles/FeedContent.module.scss";
import { FeedProps } from "@/type";
export default memo(function FeedContent({ data }: { data: FeedProps }) {
    return (
        <div className={styles["feed-content"]}>
            <strong className={styles["feed-content__id"]}>
                {data.nickname}
            </strong>
            {data.content}
        </div>
    );
});
