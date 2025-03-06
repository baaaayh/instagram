import { lazy, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
const ThumbList = lazy(() => import("@/components/ThumbList"));
import SpinnerComponent from "@/components/SpinnerComponent";
import { useAuthStore } from "@/store/authStore";
import styles from "@/assets/styles/ExploreContent.module.scss";

async function fetchExploreData(userNickName: string) {
    try {
        const response = await axios.get("/api/explore", {
            params: { userNickName },
        });
        return response.data;
    } catch (error) {
        console.log(error);
        throw new Error("Failed to fetch random users");
    }
}

export default function ExploreContent() {
    const { userNickName } = useAuthStore();
    const {
        data: thumbListData,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["thumbListData", userNickName],
        queryFn: () => fetchExploreData(userNickName),
        enabled: !!userNickName,
        staleTime: 600000,
    });

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading users list</div>;

    return (
        <div className={styles["explore-content"]}>
            <Suspense fallback={<SpinnerComponent />}>
                <ThumbList data={thumbListData.feeds} />
            </Suspense>
        </div>
    );
}
