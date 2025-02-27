import { useCallback } from "react";
import axios from "axios";
import { useModalStore } from "@/store/modalStore";
import { useAuthStore } from "@/store/authStore";
import { FeedProps } from "@/type";
import styles from "@/assets/styles/FeedFooter.module.scss";

async function fetchUserData(nickName: string, userNickName: string) {
    const response = await axios.post(`/api/user`, {
        params: { nickName, userNickName },
    });
    return response.data;
}

export default function FeedComments({ data }: { data: FeedProps }) {
    const { userNickName } = useAuthStore();
    const { setOpenFeedModal } = useModalStore();

    const handleFetchData = useCallback(async () => {
        const result = await fetchUserData(data.nickname, userNickName);
        setOpenFeedModal(result, data);
    }, [userNickName, data, setOpenFeedModal]);

    return (
        <div className={styles["feed-footer__comments"]}>
            <button type="button" onClick={handleFetchData}>
                댓글 {} 개 모두 보기
            </button>
        </div>
    );
}
