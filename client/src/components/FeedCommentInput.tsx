import { useState, useCallback, memo } from "react";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";
import styles from "@/assets/styles/FeedCommentInput.module.scss";

async function submitComment(formData: FormData) {
    try {
        const response = await axios.post("/api/comment/post", formData);
        return response.data;
    } catch (error) {
        console.log(error);
        throw new Error("댓글 제출에 실패했습니다.");
    }
}

export default memo(function FeedCommentInput({
    feedId,
    parentCommentId,
}: {
    feedId: string;
    parentCommentId: string | null;
}) {
    const { userNickName } = useAuthStore();
    const [comment, setComment] = useState("");
    const queryClient = useQueryClient();

    const handleComment = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setComment(e.target.value);
        },
        []
    );

    const feedDataMutation = useMutation({
        mutationFn: async () => {
            const formData = new FormData();
            formData.append("feed_id", feedId);
            formData.append("user_nickname", userNickName);
            formData.append(
                "parent_comment_id",
                parentCommentId ? parentCommentId : ""
            );
            formData.append("comment", comment);

            return await submitComment(formData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["feedList", userNickName],
            });
            setComment("");
        },
        onError: (error: Error) => {
            console.error(error.message);
        },
    });

    const handleSubmit = useCallback(
        (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            feedDataMutation.mutate(); // 댓글 제출 요청
        },
        [feedDataMutation]
    );

    return (
        <div className={styles["comment-input"]}>
            <form onSubmit={handleSubmit}>
                <div className={styles["comment-input__row"]}>
                    <input type="hidden" name="feed_id" value={feedId} />
                    <input
                        type="hidden"
                        name="user_nickname"
                        value={userNickName}
                    />
                    <input
                        type="hidden"
                        name="parent_comment_id"
                        value={parentCommentId ? parentCommentId : ""}
                    />
                    <input
                        type="text"
                        name="comment"
                        value={comment}
                        onChange={handleComment}
                        placeholder="댓글 달기..."
                    />
                    {comment.length > 0 && (
                        <button
                            type="submit"
                            className={styles["comment-input__button"]}
                        >
                            <span>게시</span>
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
});
