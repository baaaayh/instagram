import axios from "axios";

export async function followUser({
    isFollow,
    userNickName,
    nickName,
}: {
    isFollow: boolean;
    userNickName: string;
    nickName: string;
}) {
    try {
        const result = await axios.post("/api/follow/post", {
            params: { isFollow: !isFollow, userNickName, nickName },
        });
        return result.data;
    } catch (error) {
        console.log(error);
    }
}

export async function unfollowUser({
    isFollow,
    userNickName,
    nickName,
}: {
    isFollow: boolean;
    userNickName: string;
    nickName: string;
}) {
    try {
        const result = await axios.post("/api/follow/delete", {
            params: { isFollow: !isFollow, userNickName, nickName },
        });
        return result.data;
    } catch (error) {
        console.log(error);
    }
}
