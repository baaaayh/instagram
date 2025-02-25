import { memo } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import UserHeader from "@/components/UserHeader";
// import ThumbList from "@/components/ThumbList";
import { useAuthStore } from "@/store/authStore";
import styles from "@/assets/styles/User.module.scss";

async function fetchUserData(
    nickName: string | undefined,
    userNickName: string | undefined
) {
    if (!nickName) throw new Error("User nickname is required");
    const response = await axios.post(`/api/user`, {
        params: { nickName, userNickName },
    });
    return response.data;
}

export default memo(function User() {
    const { nickName } = useParams();
    const { userNickName } = useAuthStore();

    const { data, error, isLoading } = useQuery({
        queryKey: ["userPageData", nickName],
        queryFn: () => fetchUserData(nickName, userNickName),
        enabled: !!nickName,
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading user data</div>;

    return (
        <div className={styles["user"]}>
            <div className={styles["user__inner"]}>
                <UserHeader data={data} userNickName={userNickName} />
                {/* <ThumbList feeds={data.user.feeds} /> */}
            </div>
        </div>
    );
});
