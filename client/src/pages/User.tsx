import { useReducer, memo } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import UserHeader from "@/components/UserHeader";
import UserTab from "@/components/UserTab";
import ThumbList from "@/components/ThumbList";
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

const initialState = {
    currentContents: "FEEDS",
};

interface initialState {
    currentContents: string;
}

function reducer(state: initialState, action: { type: string }) {
    switch (action.type) {
        case "DATA_FEED":
            return { ...state, currentContents: "FEEDS" };
        case "DATA_REELS":
            return { ...state, currentContents: "REELS" };
        case "DATA_TAGS":
            return { ...state, currentContents: "TAGS" };
        default:
            return state;
    }
}

export default memo(function User() {
    const { nickName } = useParams();
    const { userNickName } = useAuthStore();

    const { data, error, isLoading } = useQuery({
        queryKey: ["userPageData", nickName],
        queryFn: () => fetchUserData(nickName, userNickName),
        enabled: !!nickName,
    });
    const [state, dispatch] = useReducer(reducer, initialState);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading user data</div>;

    return (
        <div className={styles["user"]}>
            <div className={styles["user__inner"]}>
                <UserHeader data={data} userNickName={userNickName} />
                <UserTab dispatch={dispatch} />
                <div className={styles["user__contents"]}>
                    {state.currentContents === "FEEDS" && (
                        <ThumbList data={data} />
                    )}
                    {state.currentContents === "REELS" && <div></div>}
                    {state.currentContents === "TAGS" && <div></div>}
                </div>
            </div>
        </div>
    );
});
