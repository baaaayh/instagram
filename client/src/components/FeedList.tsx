import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Feed from "@/components/Feed";
import { useAuthStore } from "@/store/authStore";
import styles from "@/assets/styles/FeedList.module.scss";
import { FeedProps } from "@/type";

async function fetchFeedList(userNickName: string) {
    const response = await axios.get("/api/feed/get", {
        params: { userNickName },
    });
    return response.data.feedInfo;
}

export default function FeedList() {
    const { userNickName } = useAuthStore();

    const {
        data: feedList,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["feedList", userNickName],
        queryFn: () => fetchFeedList(userNickName),
        enabled: !!userNickName,
        staleTime: 600000,
    });

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading feed list</div>;

    return (
        <div className={styles["feed-list"]}>
            <div className={styles["feed-list__inner"]}>
                {feedList?.length > 0 &&
                    feedList.map((data: FeedProps) => (
                        <Feed key={data.feed_id} data={data} />
                    ))}
            </div>
        </div>
    );
}
