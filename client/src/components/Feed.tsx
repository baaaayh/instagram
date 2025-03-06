import { memo, lazy } from "react";
const FeedHeader = lazy(() => import("@/components/FeedHeader"));
const FeedBody = lazy(() => import("@/components/FeedBody"));
const FeedFooter = lazy(() => import("@/components/FeedFooter"));
import styles from "@/assets/styles/Feed.module.scss";
import { FeedProps } from "@/type";

export default memo(function Feed({ data }: { data: FeedProps }) {
    return (
        <div className={styles["feed"]}>
            <FeedHeader data={data} />
            <FeedBody data={data} />
            <FeedFooter data={data} comments={true} />
        </div>
    );
});
