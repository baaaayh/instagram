import ThumbListItem from "@/components/ThumbListItem";
import styles from "@/assets/styles/ThumbList.module.scss";
import { UserPageProps } from "@/type";
export default function ThumbList({ data }: { data: UserPageProps }) {
    return (
        <div className={styles["thumb-list"]}>
            <ul>
                {Array.isArray(data.user.feeds) &&
                    data.user.feeds.map((feed) => {
                        return (
                            <li key={feed.feed_id}>
                                <ThumbListItem feed={feed} />
                            </li>
                        );
                    })}
            </ul>
        </div>
    );
}
