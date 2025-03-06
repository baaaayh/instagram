import { memo } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import UserComponent from "@/components/UserComponent";
// import SpinnerComponent from "@/components/SpinnerComponent";
import { useAuthStore } from "@/store/authStore";
import styles from "@/assets/styles/SideBar.module.scss";
import { UserDataProps } from "@/type";

async function fetchRecommendUsers(userNickName: string) {
    try {
        const response = await axios.get("/api/user/recommend", {
            params: { userNickName },
        });
        return response.data.users;
    } catch (error) {
        console.log(error);
        throw new Error("Failed to fetch random users");
    }
}

export default memo(function SideBar() {
    const { userId, userName, userNickName, userProfileImage, userIntro } =
        useAuthStore();

    const {
        data: recommendUsers,
        // isLoading,
        // isError,
    } = useQuery({
        queryKey: ["recommendUsers", userNickName],
        queryFn: () => fetchRecommendUsers(userNickName),
        enabled: !!userNickName,
        staleTime: 600000,
    });

    // if (isLoading) return <SpinnerComponent />;
    // if (isError) return <div>Error loading users list</div>;

    return (
        <div className={styles["side-bar"]}>
            <div className={styles["side-bar__profile"]}>
                <UserComponent
                    data={{
                        is_following: false,
                        id: userId,
                        username: userName,
                        nickname: userNickName,
                        profile_image: userProfileImage,
                        intro: userIntro,
                    }}
                    isFollowButton={false}
                />
            </div>
            <div className={styles["side-bar__title"]}>
                <h3>회원님을 위한 추천</h3>
            </div>
            <div className={styles["side-bar__users"]}>
                <ul>
                    {recommendUsers && recommendUsers.length > 0 ? (
                        recommendUsers.map((user: UserDataProps) => (
                            <UserComponent
                                key={user.nickname}
                                data={user}
                                isFollowButton={true}
                            />
                        ))
                    ) : (
                        <li>No random users found</li>
                    )}
                </ul>
            </div>
        </div>
    );
});
