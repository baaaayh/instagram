import { memo } from "react";
export default memo(function FeedLikes({ likes }: { likes: number }) {
    return (
        <div>
            <strong>좋아요</strong> {likes} 개
        </div>
    );
});
