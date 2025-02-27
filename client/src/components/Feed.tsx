import FeedHeader from "@/components/FeedHeader";
import FeedBody from "@/components/FeedBody";
import FeedFooter from "@/components/FeedFooter";
import styles from "@/assets/styles/Feed.module.scss";
import { FeedProps } from "@/type";

export default function Feed({ data }: { data: FeedProps }) {
    return (
        <div className={styles["feed"]}>
            <FeedHeader data={data} />
            <FeedBody data={data} />
            <FeedFooter data={data} comments={true} />
        </div>
    );
}
