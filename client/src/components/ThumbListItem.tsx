import { memo } from "react";
import { useModalStore } from "@/store/modalStore";
import { FeedProps } from "@/type";
import styles from "@/assets/styles/ThumbListItem.module.scss";

export default memo(function ThumbListItem({ feed }: { feed: FeedProps }) {
    const { setOpenFeedModal } = useModalStore();

    return (
        <div className={styles["thumb-item"]}>
            <button
                type="button"
                className={styles["thumb-item__bg"]}
                style={{ backgroundImage: `url(${feed.images[0].file_path})` }}
                onClick={() => setOpenFeedModal(feed.feed_id)}
            ></button>
        </div>
    );
});
