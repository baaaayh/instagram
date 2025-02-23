import { useEffect, useState } from "react";
import axios from "axios";
import Feed from "@/components/Feed";
import { useAuthStore } from "@/store/authStore";
import styles from "@/assets/styles/FeedList.module.scss";

export interface FeedProps {
    feed_id: string;
    author_id: string;
    author_name: string;
    content: string | null;
    feed_created_at: string;
    images: Array<{ file_path: string; file_name: string }>;
}

export default function FeedList() {
    const { userId } = useAuthStore();
    const [feedList, setFeedList] = useState<FeedProps[]>([]);

    useEffect(() => {
        async function getFeedList() {
            const response = await axios.get("/api/feed/get", {
                params: { userId },
            });
            if (response.data.feedInfo.length > 0) {
                setFeedList(response.data.feedInfo);
            }
        }
        getFeedList();
    }, [userId]);

    console.log(feedList);

    return (
        <div className={styles["feed-list"]}>
            <div className={styles["feed-list__inner"]}>
                {feedList.length > 0 &&
                    feedList.map((data) => (
                        <Feed key={data.feed_id} data={data} />
                    ))}
            </div>
        </div>
    );
}
