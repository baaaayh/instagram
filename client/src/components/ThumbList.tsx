import ThumbListItem from "@/components/ThumbListItem";
import styles from "@/assets/styles/ThumbList.module.scss";
import { UserPageProps, ThumbListItemProps } from "@/type";

type ThumbListProps = {
    data: UserPageProps | ThumbListItemProps;
};

export default function ThumbList({ data }: ThumbListProps) {
    const feeds =
        data && data.user && "feeds" in data.user ? data.user.feeds : data;

    return (
        <div className={styles["thumb-list"]}>
            <ul>
                {Array.isArray(feeds) &&
                    feeds.map((feed) => {
                        // console.log(feed);
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
