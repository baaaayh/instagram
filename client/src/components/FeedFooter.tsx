import { useCallback, memo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import FeedButtons from "@/components/FeedButtons";
import FeedLikes from "@/components/FeedLikes";
import FeedContent from "@/components/FeedContent";
import FeedComments from "@/components/FeedComments";
import FeedCommentInput from "@/components/FeedCommentInput";
import styles from "@/assets/styles/FeedFooter.module.scss";
import { useAuthStore } from "@/store/authStore";
import { likeFeed, unlikeFeed } from "@/api/likeActions";
import { FeedProps } from "@/type";

export default memo(function FeedFooter({
    data,
    comments,
}: {
    data: FeedProps;
    comments: boolean;
}) {
    const queryClient = useQueryClient();
    const { feed_id, is_liked, like_count } = data;
    const { userNickName } = useAuthStore();

    const likeMutation = useMutation({
        mutationFn: async (userAction: "UNLIKE" | "LIKE") => {
            if (userAction === "LIKE") {
                await likeFeed({ feed_id, userNickName });
            } else {
                await unlikeFeed({ feed_id, userNickName });
            }
        },
        onMutate: async (userAction) => {
            await queryClient.cancelQueries({
                queryKey: ["feedData", feed_id],
            });

            const prevData = queryClient.getQueryData(["feedData", feed_id]);

            queryClient.setQueryData(
                ["feedData", feed_id],
                (prev: FeedProps) => {
                    return {
                        ...prev,
                        like_count:
                            userAction === "LIKE"
                                ? Number(prev.like_count) + 1
                                : Number(prev.like_count) - 1,
                        is_liked: userAction === "LIKE", // 상태를 수정
                    };
                }
            );

            return { prevData };
        },
        onError: (error, _, context) => {
            queryClient.setQueryData(["feedData", feed_id], context?.prevData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["feedData", feed_id], // 피드 데이터 무효화
            });
            queryClient.invalidateQueries({
                queryKey: ["feedList", userNickName], // 피드 리스트 무효화
            });
        },
    });

    const handleLike = useCallback(() => {
        console.log(is_liked);
        likeMutation.mutate(is_liked ? "UNLIKE" : "LIKE");
    }, [likeMutation, is_liked]);

    return (
        <div className={styles["feed-footer"]}>
            <div className={styles["feed-footer__inner"]}>
                <FeedButtons handleLike={handleLike} isLike={data.is_liked} />
                <FeedLikes likes={Number(like_count)} />
                <FeedContent data={data} />
                {comments && <FeedComments data={data} />}
                <FeedCommentInput feedId={feed_id} parentCommentId={null} />
            </div>
        </div>
    );
});
