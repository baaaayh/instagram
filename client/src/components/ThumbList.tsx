import { memo, lazy, Suspense } from "react";
const ThumbListItem = lazy(() => import("@/components/ThumbListItem"));
import SpinnerComponent from "@/components/SpinnerComponent";
import styles from "@/assets/styles/ThumbList.module.scss";
import { UserPageProps, ThumbListItemProps } from "@/type";

type ThumbListProps = {
    data: UserPageProps | ThumbListItemProps;
};

export default memo(function ThumbList({ data }: ThumbListProps) {
    const feeds =
        data && data.user && "feeds" in data.user ? data.user.feeds : data;

    return (
        <div className={styles["thumb-list"]}>
            <ul>
                {Array.isArray(feeds) &&
                    feeds.map((feed) => {
                        // console.log(feed);
                        return (
                            <Suspense
                                key={feed.feed_id}
                                fallback={<SpinnerComponent />}
                            >
                                <li>
                                    <ThumbListItem feed={feed} />
                                </li>
                            </Suspense>
                        );
                    })}
            </ul>
        </div>
    );
});
