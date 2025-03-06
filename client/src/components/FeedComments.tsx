import { memo } from "react";
import { FeedProps } from "@/type";
import styles from "@/assets/styles/FeedFooter.module.scss";
import { useModalStore } from "@/store/modalStore";
export default memo(function FeedComments({ data }: { data: FeedProps }) {
    const { setOpenFeedModal } = useModalStore();
    return (
        <div className={styles["feed-footer__comments"]}>
            <button
                type="button"
                onClick={() => setOpenFeedModal(data.feed_id)}
            >
                댓글 {data.comments.length > 0 ? data.comments.length : 0} 개
                모두 보기
            </button>
        </div>
    );
});
