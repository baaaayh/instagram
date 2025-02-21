import FeedHeader from "@/components/FeedHeader";
import styles from "@/assets/styles/Feed.module.scss";
export default function Feed() {
    return (
        <div className={styles["feed"]}>
            <FeedHeader />
        </div>
    );
}
