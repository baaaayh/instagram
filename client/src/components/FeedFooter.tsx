import { useState, memo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import FeedButtons from "@/components/FeedButtons";
import FeedLikes from "@/components/FeedLikes";
import FeedContent from "@/components/FeedContent";
import FeedComments from "@/components/FeedComments";
import styles from "@/assets/styles/FeedFooter.module.scss";
import { useAuthStore } from "@/store/authStore";
import { likeFeed, unlikeFeed } from "@/api/likeActions";
import { FeedProps } from "@/type";

export default memo(function FeedFooter({ data }: { data: FeedProps }) {
    const queryClient = useQueryClient();
    const { feed_id, is_liked, like_count } = data;
    const { userNickName } = useAuthStore();
    const [likeCount, setLikeCount] = useState(like_count);
    const [isLike, setIsLike] = useState(is_liked);

    const likeMutation = useMutation({
        mutationFn: () => {
            if (isLike) {
                return unlikeFeed({ isLike, feed_id, userNickName });
            } else {
                return likeFeed({ isLike, feed_id, userNickName });
            }
        },
        onSuccess: (data) => {
            if (data.success) {
                setLikeCount(data.like_count);
                setIsLike(data.is_liked);

                queryClient.setQueryData(
                    ["feed", feed_id],
                    (oldData: FeedProps) => ({
                        ...oldData,
                        is_liked: data.is_liked,
                        like_count: data.like_count,
                    })
                );
                queryClient.invalidateQueries({
                    queryKey: ["feedList", userNickName],
                });
            }
        },
        onError: (error) => {
            console.error("좋아요 변경 실패:", error);
        },
    });

    return (
        <div className={styles["feed-footer"]}>
            <div className={styles["feed-footer__inner"]}>
                <FeedButtons
                    handleLike={() => likeMutation.mutate()}
                    isLike={isLike}
                />
                <FeedLikes likes={likeCount} />
                <FeedContent data={data} />
                <FeedComments />
            </div>
        </div>
    );
});
