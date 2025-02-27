import axios from "axios";

export async function likeFeed({
    feed_id,
    userNickName,
}: {
    feed_id: string;
    userNickName: string;
}) {
    console.log(feed_id);
    try {
        const response = await axios.post("/api/feed/like", {
            params: { like: true, feedId: feed_id, userNickName },
        });
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export async function unlikeFeed({
    feed_id,
    userNickName,
}: {
    feed_id: string;
    userNickName: string;
}) {
    console.log(feed_id);
    try {
        const response = await axios.post("/api/feed/unlike", {
            params: { like: false, feedId: feed_id, userNickName },
        });
        return response.data;
    } catch (error) {
        console.log(error);
    }
}
