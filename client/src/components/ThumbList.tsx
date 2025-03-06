import { memo, lazy, Suspense } from "react";
import ThumbListItem from "@/components/ThumbListItem";
const CameraIcon = lazy(
    () => import("@/assets/images/icons/icon_camera.svg?react")
);
import SpinnerComponent from "@/components/SpinnerComponent";
import { useModalStore } from "@/store/modalStore";
import styles from "@/assets/styles/ThumbList.module.scss";
import { UserPageProps, ThumbListItemProps } from "@/type";

type ThumbListProps = {
    data: UserPageProps | ThumbListItemProps;
};

export default memo(function ThumbList({ data }: ThumbListProps) {
    const feeds =
        data && data.user && "feeds" in data.user ? data.user.feeds : data;
    const { setOpenPostModal } = useModalStore();

    return (
        <div className={styles["thumb-list"]}>
            {Array.isArray(feeds) && feeds.length <= 0 ? (
                <div className={styles["thumb-list__empty"]}>
                    <button type="button" onClick={setOpenPostModal}>
                        <CameraIcon />
                    </button>
                    <h3>사진 공유</h3>
                    <p>사진을 공유하면 회원님의 프로필에 표시됩니다.</p>
                    <button type="button" onClick={setOpenPostModal}>
                        <span>첫 사진 공유하기</span>
                    </button>
                </div>
            ) : (
                <ul>
                    {Array.isArray(feeds) &&
                        feeds.map((feed) => {
                            return (
                                <Suspense
                                    key={feed.feed_id}
                                    fallback={<SpinnerComponent />}
                                >
                                    <li>
                                        <ThumbListItem feed={feed} />
                                    </li>
                                </Suspense>
                            );
                        })}
                </ul>
            )}
        </div>
    );
});
