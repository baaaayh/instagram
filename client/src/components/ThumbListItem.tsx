import { memo } from "react";
import { useModalStore } from "@/store/modalStore";
import { UserPageProps, FeedProps } from "@/type";
import styles from "@/assets/styles/ThumbListItem.module.scss";

export default memo(function ThumbListItem({
    data,
    feed,
}: {
    data: UserPageProps;
    feed: FeedProps;
}) {
    const { setOpenFeedModal } = useModalStore();

    return (
        <div className={styles["thumb-item"]}>
            <button
                type="button"
                className={styles["thumb-item__bg"]}
                style={{ backgroundImage: `url(${feed.images[0].file_path})` }}
                onClick={() => setOpenFeedModal(data, feed)}
            ></button>
        </div>
    );
});
