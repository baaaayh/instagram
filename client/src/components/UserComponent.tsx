import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import ProfileIcon from "@/components/ProfileIcon";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { followUser, unFollowUser } from "@/api/followActions";
import { useAuthStore } from "@/store/authStore";
import { useHistoryStore } from "@/store/historyStore";
import CloseIcon from "@/assets/images/icons/icon_close.svg?react";
import clsx from "clsx";
import styles from "@/assets/styles/UserComponent.module.scss";
import { UserDataProps } from "@/type";

export default function UserComponent({
    data,
    isFollowButton,
    isDeleteButton,
}: {
    data: UserDataProps;
    isFollowButton: boolean;
    isDeleteButton?: boolean;
}) {
    const { userNickName } = useAuthStore();
    const queryClient = useQueryClient();
    const [isFollow, setIsFollow] = useState(data.is_following);
    const { username, nickname: nickName, profile_image } = data;
    const { removeHistory, setHistory } = useHistoryStore();

    const recommendUsersMutation = useMutation({
        mutationFn: async () => {
            if (!isFollow) {
                return await followUser({ isFollow, userNickName, nickName });
            } else {
                return await unFollowUser({ isFollow, userNickName, nickName });
            }
        },
        onMutate: async () => {
            await queryClient.cancelQueries({
                queryKey: ["recommendUsers", userNickName],
            });

            const previousData = queryClient.getQueryData([
                "recommendUsers",
                userNickName,
            ]);

            queryClient.setQueryData(
                ["recommendUsers", userNickName],
                (oldData: UserDataProps[] | undefined) => {
                    if (!oldData) return [];

                    return oldData.map((user) =>
                        user.nickname === nickName
                            ? { ...user, is_following: !user.is_following }
                            : user
                    );
                }
            );

            return { previousData };
        },

        onSuccess: () => {
            setIsFollow((prev) => !prev);
            queryClient.invalidateQueries({
                queryKey: ["recommendUsers", userNickName],
            });
        },
        onError: (error, _, context) => {
            console.log(error);
            if (context?.previousData) {
                queryClient.setQueryData(
                    ["recommendUsers", userNickName],
                    context.previousData
                );
            }
        },
    });

    const handleFollow = useCallback(() => {
        recommendUsersMutation.mutate();
    }, [recommendUsersMutation]);

    return (
        <li className={styles["user"]}>
            <div className={styles["user__inner"]}>
                <div className={styles["user__profile"]}>
                    <div className={styles["user__figure"]}>
                        <Link
                            to={`/${nickName}`}
                            onClick={() => setHistory(data)}
                        >
                            {profile_image ? (
                                <img
                                    src={profile_image}
                                    alt={`${nickName}의 프로필`}
                                />
                            ) : (
                                <ProfileIcon width={44} height={44} />
                            )}
                        </Link>
                    </div>
                    <div className={styles["user__info"]}>
                        <div className={styles["user__nickname"]}>
                            <Link
                                to={`/${nickName}`}
                                onClick={() => setHistory(data)}
                            >
                                {nickName}
                            </Link>
                        </div>
                        <div className={styles["user__name"]}>{username}</div>
                    </div>
                </div>
                {isFollowButton ? (
                    <button
                        type="button"
                        className={clsx(styles["user__button"], {
                            [styles["user__button--bk"]]: isFollow,
                        })}
                        onClick={handleFollow}
                    >
                        <span>{isFollow ? "팔로잉" : "팔로우"}</span>
                    </button>
                ) : (
                    !isDeleteButton && (
                        <Link to={`/${nickName}`}>
                            <span>전환</span>
                        </Link>
                    )
                )}
                {!isFollowButton && isDeleteButton && (
                    <button
                        type="button"
                        className={styles["user__delete"]}
                        onClick={() => removeHistory(nickName)}
                    >
                        <span>
                            <CloseIcon />
                            삭제
                        </span>
                    </button>
                )}
            </div>
        </li>
    );
}
