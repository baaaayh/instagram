export interface FeedProps {
    feed_id: string;
    user_id: string;
    user_name: string;
    nickname: string;
    content: string | null;
    feed_created_at: string;
    images: Array<{ file_path: string; file_name: string }>;
    profile_image: string | null;
    time_diff_seconds: number;
    is_liked: boolean;
    like_count: number;
}

export interface FeedsProps {
    feeds: Array<FeedProps>;
}

export interface UserPageProps {
    success: boolean;
    user: {
        feeds: FeedsProps;
        is_following: boolean;
        nickname: string;
        profile_image: string | null;
        intro: string | null;
        followers: number;
        followings: number;
    };
}
