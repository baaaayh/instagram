import FeedHeader from "@/components/FeedHeader";
import FeedBody from "@/components/FeedBody";
import styles from "@/assets/styles/Feed.module.scss";
import { FeedProps } from "@/components/FeedList";

export default function Feed({ data }: { data: FeedProps }) {
    return (
        <div className={styles["feed"]}>
            <FeedHeader />
            <FeedBody data={data} />
        </div>
    );
}
