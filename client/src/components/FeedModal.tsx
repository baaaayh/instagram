import { memo } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ProfileIcon from "@/components/ProfileIcon";
import ModalContainer from "@/components/ModalContainer";
import More from "@/assets/images/icons/icon_more.svg?react";
import FeedComment from "@/components/FeedComment";
import FeedFooter from "@/components/FeedFooter";
import { useModalStore } from "@/store/modalStore";
import { useAuthStore } from "@/store/authStore";
import { CommentProps } from "@/type";
import styles from "@/assets/styles/FeedModal.module.scss";

async function fetchFeedData(feedId: string) {
    const response = await axios.get(`/api/feed/${feedId}`, {
        params: { userNickName: useAuthStore.getState().userNickName },
    });
    return response.data.feedInfo;
}

export default memo(function FeedModal() {
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

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading feed list</div>;

    console.log(feedData);

    return (
        <ModalContainer isOpen={isOpenFeedModal} closeModal={setCloseFeedModal}>
            <div className={styles["feed-modal"]}>
                <div className={styles["feed-modal__left"]}>
                    {feedData && feedData.images.length <= 1 ? (
                        <div>
                            <img src={feedData.images[0].file_path} alt="" />
                        </div>
                    ) : (
                        <Slider>
                            {feedData &&
                                feedData.images.map(
                                    (image: { file_path: string }) => (
                                        <div
                                            key={image.file_path}
                                            className={
                                                styles["feed-modal__slide"]
                                            }
                                        >
                                            <img src={image.file_path} alt="" />
                                        </div>
                                    )
                                )}
                        </Slider>
                    )}
                </div>
                <div className={styles["feed-modal__right"]}>
                    <div className={styles["feed-modal__header"]}>
                        <div className={styles["feed-modal__user"]}>
                            <div className={styles["feed-modal__user__img"]}>
                                <ProfileIcon width={24} height={24} />
                            </div>
                            <div className={styles["feed-modal__user__id"]}>
                                {feedData?.user_nickname}
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
                            <div className={styles["feed-modal__content"]}>
                                {feedData?.content && (
                                    <FeedComment
                                        currentUser={feedData?.user_nickname}
                                        data={feedData.content}
                                    />
                                )}
                            </div>
                            <div className={styles["feed-modal__comments"]}>
                                {feedData?.comments.map(
                                    (comment: CommentProps) => (
                                        <FeedComment
                                            key={comment.comment_id}
                                            currentUser={
                                                feedData?.user_nickname
                                            }
                                            data={comment}
                                        />
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                    {feedData && (
                        <FeedFooter data={feedData} comments={false} />
                    )}
                </div>
            </div>
        </ModalContainer>
    );
});
