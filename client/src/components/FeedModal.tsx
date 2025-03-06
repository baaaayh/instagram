import { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useModalStore } from "@/store/modalStore";
import { useAuthStore } from "@/store/authStore";
import { CommentProps } from "@/type";
import styles from "@/assets/styles/FeedModal.module.scss";

const ProfileIcon = lazy(() => import("@/components/ProfileIcon"));
const ModalContainer = lazy(() => import("@/components/ModalContainer"));
const More = lazy(() => import("@/assets/images/icons/icon_more.svg?react"));
const FeedComment = lazy(() => import("@/components/FeedComment"));
const FeedFooter = lazy(() => import("@/components/FeedFooter"));
const FeedSliderItem = lazy(() => import("@/components/FeedSliderItem"));

async function fetchFeedData(feedId: string) {
    const response = await axios.get(`/api/feed/${feedId}`, {
        params: { userNickName: useAuthStore.getState().userNickName },
    });
    return response.data.feedInfo;
}

export default function FeedModal() {
    const {
        currentFeedId: feedId,
        isOpenFeedModal,
        setCloseFeedModal,
    } = useModalStore();

    const {
        data: feedData,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["feedData", feedId],
        queryFn: () => {
            if (!feedId) return;
            return fetchFeedData(feedId);
        },
        enabled: !!feedId,
        staleTime: 600000,
    });

    const settings = {
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: true,
    };

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading feed list</div>;

    return (
        <ModalContainer isOpen={isOpenFeedModal} closeModal={setCloseFeedModal}>
            <div className={styles["feed-modal"]}>
                <div className={styles["feed-modal__left"]}>
                    {feedData && feedData.images.length <= 1 ? (
                        <div>
                            <img src={feedData.images[0].file_path} alt="" />
                        </div>
                    ) : (
                        <Slider {...settings}>
                            {feedData &&
                                feedData.images.map(
                                    (image: {
                                        file_path: string;
                                        file_name: string;
                                    }) => (
                                        <FeedSliderItem
                                            key={image.file_name}
                                            image={image}
                                        />
                                    )
                                )}
                        </Slider>
                    )}
                </div>
                <div className={styles["feed-modal__right"]}>
                    <div className={styles["feed-modal__header"]}>
                        <div className={styles["feed-modal__user"]}>
                            <div className={styles["feed-modal__figure"]}>
                                <Link to={`/${feedData?.user_nickname}`}>
                                    <ProfileIcon width={32} height={32} />
                                </Link>
                            </div>
                            <div className={styles["feed-modal__user__id"]}>
                                <Link to={`/${feedData?.user_nickname}`}>
                                    {feedData?.user_nickname}
                                </Link>
                            </div>
                        </div>
                        <div className={styles["feed-modal__more"]}>
                            <button type="button">
                                <span>
                                    <More />더 보기
                                </span>
                            </button>
                        </div>
                    </div>
                    <div className={styles["feed-modal__body"]}>
                        <div className={styles["feed-modal__inner"]}>
                            <div className={styles["feed-modal__main"]}>
                                <div className={styles["feed-modal__content"]}>
                                    {feedData?.content && (
                                        <FeedComment
                                            user={feedData?.user_nickname}
                                            data={feedData.content}
                                        />
                                    )}
                                </div>
                                <div className={styles["feed-modal__comments"]}>
                                    {feedData?.comments
                                        .reverse()
                                        .map((comment: CommentProps) => (
                                            <Suspense
                                                key={comment.comment_id}
                                                fallback={
                                                    <div>
                                                        Loading comment...
                                                    </div>
                                                }
                                            >
                                                <FeedComment
                                                    user={comment.user_nickname}
                                                    data={comment}
                                                />
                                            </Suspense>
                                        ))}
                                </div>
                            </div>
                        </div>
                        {feedData && (
                            <Suspense fallback={<div>Loading footer...</div>}>
                                <FeedFooter data={feedData} comments={false} />
                            </Suspense>
                        )}
                    </div>
                </div>
            </div>
        </ModalContainer>
    );
}
