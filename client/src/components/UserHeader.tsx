import { useState, memo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { followUser, unFollowUser } from "@/api/followActions";
import More from "@/assets/images/icons/icon_more.svg?react";
import { useModalStore } from "@/store/modalStore";
import styles from "@/assets/styles/UserHeader.module.scss";
import { UserPageProps } from "@/type";

export default memo(function UserHeader({
    data,
    userNickName,
}: {
    data: UserPageProps;
    userNickName: string;
}) {
    const {
        user: {
            feeds = [],
            intro,
            is_following: isFollowing,
            nickname: nickName,
            profile_image: profileImage,
            followers,
            followings,
        },
    } = data;

    const [isFollow, setIsFollow] = useState(isFollowing);
    const queryClient = useQueryClient();
    const { setOpenAccountModal } = useModalStore();

    const followMutation = useMutation({
        mutationFn: () => {
            if (isFollow) {
                return unFollowUser({ isFollow, userNickName, nickName });
            } else {
                return followUser({ isFollow, userNickName, nickName });
            }
        },
        onSuccess: (data) => {
            if (data.success) {
                setIsFollow(data.isFollow);
                queryClient.setQueryData(
                    ["userPageData", nickName],
                    (oldData: Partial<UserPageProps>) => {
                        if (!oldData || !oldData.user) return oldData;

                        const newFollowers = data.isFollow
                            ? oldData.user.followers + 1
                            : oldData.user.followers - 1;

                        return {
                            ...oldData,
                            user: {
                                ...oldData.user,
                                is_following: data.isFollow,
                                followers: newFollowers,
                            },
                        };
                    }
                );
                queryClient.invalidateQueries({
                    queryKey: ["feedList", userNickName],
                });
                queryClient.invalidateQueries({
                    queryKey: ["userPageData", nickName],
                });
            }
        },
        onError: (error) => {
            console.log(error);
        },
    });

    return (
        <div className={styles["user-header"]}>
            <div className={styles["user-header__inner"]}>
                <div className={styles["user-header__profile"]}>
                    <div className={styles["user-header__image"]}>
                        <span className={styles["user-header__outer"]}>
                            <span className={styles["user-header__circle"]}>
                                {profileImage ? (
                                    <img src={profileImage} alt="profile" />
                                ) : (
                                    <span>이미지 없음</span>
                                )}
                            </span>
                        </span>
                    </div>
                    <div className={styles["user-header__info"]}>
                        <div className={styles["user-header__relation"]}>
                            <div className={styles["user-header__nickname"]}>
                                <span>{nickName}</span>
                            </div>
                            <div className={styles["user-header__buttons"]}>
                                <ul>
                                    <li>
                                        {isFollow ? (
                                            <button
                                                type="button"
                                                className="btn btn-round btn-round--grey active"
                                                onClick={() =>
                                                    followMutation.mutate()
                                                }
                                            >
                                                <span>팔로잉</span>
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                className="btn btn-round btn-round--blue active"
                                                onClick={() =>
                                                    followMutation.mutate()
                                                }
                                            >
                                                <span>팔로우</span>
                                            </button>
                                        )}
                                    </li>
                                    <li>
                                        <button
                                            type="button"
                                            className="btn btn-round btn-round--grey active"
                                        >
                                            <span>메시지 보내기</span>
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            type="button"
                                            className={
                                                styles["user-header__more"]
                                            }
                                            onClick={setOpenAccountModal}
                                        >
                                            <span>
                                                <More />더 보기
                                            </span>
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className={styles["user-header__state"]}>
                            <ul>
                                <li>
                                    <span>게시물</span>
                                    <strong>
                                        {Array.isArray(feeds)
                                            ? feeds.length
                                            : 0}
                                    </strong>
                                </li>
                                <li>
                                    <span>팔로워</span>
                                    <strong>{followers}</strong>
                                </li>
                                <li>
                                    <span>팔로우</span>
                                    <strong>{followings}</strong>
                                </li>
                            </ul>
                        </div>
                        <div
                            className={styles["user-header__intro"]}
                            dangerouslySetInnerHTML={
                                intro ? { __html: intro } : { __html: "" }
                            }
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
});
