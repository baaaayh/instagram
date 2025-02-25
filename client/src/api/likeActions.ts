import axios from "axios";

export async function likeFeed({
    isLike,
    feed_id,
    userNickName,
}: {
    isLike: boolean;
    feed_id: string;
    userNickName: string;
}) {
    try {
        const response = await axios.post("/api/feed/like", {
            params: { like: !isLike, feedId: feed_id, userNickName },
        });
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export async function unlikeFeed({
    isLike,
    feed_id,
    userNickName,
}: {
    isLike: boolean;
    feed_id: string;
    userNickName: string;
}) {
    try {
        const response = await axios.post("/api/feed/unlike", {
            params: { like: !isLike, feedId: feed_id, userNickName },
        });
        return response.data;
    } catch (error) {
        console.log(error);
    }
}
