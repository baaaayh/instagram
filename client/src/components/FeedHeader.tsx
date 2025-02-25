import { Link } from "react-router-dom";
import FeedProfile from "@/components/FeedProfile";
import More from "@/assets/images/icons/icon_more.svg?react";
import styles from "@/assets/styles/FeedHeader.module.scss";
import { FeedProps } from "@/type";

export default function FeedHeader({ data }: { data: FeedProps }) {
    const { profile_image, nickname, time_diff_seconds } = data;

    const formatTimeDifference = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days}일 전`;
        if (hours > 0) return `${hours}시간 전`;
        if (minutes > 0) return `${minutes}분 전`;
        return "방금 전";
    };

    return (
        <div className={styles["feed-header"]}>
            <div className={styles["feed-header__inner"]}>
                <div className={styles["feed-header__user"]}>
                    <FeedProfile profile={profile_image} />
                    <Link
                        to={`/${nickname}`}
                        className={styles["feed-header__id"]}
                    >
                        {nickname}
                    </Link>
                    <span className={styles["feed-header__time"]}>
                        <span></span>
                        {formatTimeDifference(time_diff_seconds)}
                    </span>
                </div>
                <div className={styles["feed-header__more"]}>
                    <button type="button">
                        <More />
                    </button>
                </div>
            </div>
        </div>
    );
}
