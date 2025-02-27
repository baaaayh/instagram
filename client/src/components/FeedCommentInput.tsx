import axios from "axios";
import { useState, useCallback, memo } from "react";
import { useAuthStore } from "@/store/authStore";
import styles from "@/assets/styles/FeedCommentInput.module.scss";

async function submitComment(formData: FormData) {
    console.log(formData);
    try {
        const response = await axios.post("/api/comment/post", formData);
        return response.data;
    } catch (error) {
        console.log(error);
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

    const handleComment = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setComment(e.target.value);
        },
        []
    );

    const handleSubmit = useCallback(
        async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();

            const formData = new FormData(e.currentTarget);
            await submitComment(formData);
            setComment("");
        },
        []
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
