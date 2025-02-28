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

    const FEED_LIST_QUERY_KEY = ["feedList", userNickName];
    const FEED_DETAIL_QUERY_KEY = ["feedData", feed_id];

    const likeMutation = useMutation({
        mutationFn: async (userAction: "UNLIKE" | "LIKE") => {
            if (userAction === "LIKE") {
                await likeFeed({ feed_id, userNickName });
            } else {
                await unlikeFeed({ feed_id, userNickName });
            }
        },
        onMutate: async (userAction) => {
            await queryClient.cancelQueries({ queryKey: FEED_LIST_QUERY_KEY });
            await queryClient.cancelQueries({
                queryKey: FEED_DETAIL_QUERY_KEY,
            });

            const prevFeedList = queryClient.getQueryData(FEED_LIST_QUERY_KEY);
            const prevFeedDetail = queryClient.getQueryData(
                FEED_DETAIL_QUERY_KEY
            );

            queryClient.setQueryData(
                FEED_LIST_QUERY_KEY,
                (oldFeeds: FeedProps[] | undefined) => {
                    if (!oldFeeds) return oldFeeds;
                    return oldFeeds.map((feed: FeedProps) =>
                        feed.feed_id === feed_id
                            ? {
                                  ...feed,
                                  is_liked: userAction === "LIKE",
                                  like_count:
                                      userAction === "LIKE"
                                          ? feed.like_count + 1
                                          : feed.like_count - 1,
                              }
                            : feed
                    );
                }
            );

            queryClient.setQueryData(
                FEED_DETAIL_QUERY_KEY,
                (oldFeed: FeedProps) => {
                    if (!oldFeed) return oldFeed;
                    return {
                        ...oldFeed,
                        is_liked: userAction === "LIKE",
                        like_count:
                            userAction === "LIKE"
                                ? oldFeed.like_count + 1
                                : oldFeed.like_count - 1,
                    };
                }
            );

            return { prevFeedList, prevFeedDetail };
        },
        onError: (error, _, context) => {
            console.log(error);
            if (context?.prevFeedList) {
                queryClient.setQueryData(
                    FEED_LIST_QUERY_KEY,
                    context.prevFeedList
                );
            }
            if (context?.prevFeedDetail) {
                queryClient.setQueryData(
                    FEED_DETAIL_QUERY_KEY,
                    context.prevFeedDetail
                );
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: FEED_LIST_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: FEED_DETAIL_QUERY_KEY });
        },
    });

    const handleLike = useCallback(() => {
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
