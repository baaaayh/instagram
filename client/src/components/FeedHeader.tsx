import FeedProfile from "@/components/FeedProfile";
import styles from "@/assets/styles/FeedHeader.module.scss";
export default function FeedHeader() {
    return (
        <div className={styles["feed-header"]}>
            <div className={styles["feed-header__inner"]}>
                <div className={styles["feed-header__user"]}>
                    <FeedProfile />
                    <span>{}</span>
                    <span></span>
                </div>
                <div className={styles["feed-header__more"]}>
                    <button type="button">MORE</button>
                </div>
            </div>
        </div>
    );
}
