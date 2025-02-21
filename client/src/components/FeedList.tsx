import Feed from "@/components/Feed";
import styles from "@/assets/styles/FeedList.module.scss";
export default function FeedList() {
    return (
        <div className={styles["feed-list"]}>
            <div className={styles["feed-list__inner"]}>
                <Feed />
            </div>
        </div>
    );
}
