import { memo } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ProfileIcon from "@/components/ProfileIcon";
import ModalContainer from "@/components/ModalContainer";
import More from "@/assets/images/icons/icon_more.svg?react";
import FeedComment from "@/components/FeedComment";
import FeedFooter from "@/components/FeedFooter";
import { useModalStore } from "@/store/modalStore";
import styles from "@/assets/styles/FeedModal.module.scss";

export default memo(function FeedModal() {
    const { currUserData, feedData, isOpenFeedModal, setCloseFeedModal } =
        useModalStore();

    return (
        <ModalContainer
            isOpen={isOpenFeedModal}
            isCloseButton={true}
            closeModal={setCloseFeedModal}
        >
            <div className={styles["feed-modal"]}>
                <div className={styles["feed-modal__left"]}>
                    {feedData && feedData.images.length <= 1 ? (
                        <div>
                            <img src={feedData.images[0].file_path} alt="" />
                        </div>
                    ) : (
                        <Slider>
                            {feedData &&
                                feedData.images.map((image) => (
                                    <div
                                        key={image.file_path}
                                        className={styles["feed-modal__slide"]}
                                    >
                                        <img src={image.file_path} alt="" />
                                    </div>
                                ))}
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
                                {currUserData?.user.nickname}
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
                                        currentUser={currUserData}
                                        data={feedData.content}
                                    />
                                )}
                            </div>
                            <div className={styles["feed-modal__comments"]}>
                                {feedData?.comments.map((comment) => (
                                    <FeedComment
                                        key={comment.comment_id}
                                        currentUser={currUserData}
                                        data={comment}
                                    />
                                ))}
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
