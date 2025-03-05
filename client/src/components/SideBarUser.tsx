import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import ProfileIcon from "@/components/ProfileIcon";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { followUser, unFollowUser } from "@/api/followActions";
import { UserDataProps } from "@/type";
import clsx from "clsx";
import { useAuthStore } from "@/store/authStore";
import styles from "@/assets/styles/SideBarUser.module.scss";

export default function SideBarUser({
    data,
    isFollowButton,
}: {
    data: UserDataProps;
    isFollowButton: boolean;
}) {
    const { userNickName } = useAuthStore();
    const queryClient = useQueryClient();
    const [isFollow, setIsFollow] = useState(data.is_following);
    const { username, nickname: nickName, profile_image } = data;

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
                        {profile_image ? (
                            <img
                                src={profile_image}
                                alt={`${nickName}의 프로필`}
                            />
                        ) : (
                            <ProfileIcon width={44} height={44} />
                        )}
                    </div>
                    <div className={styles["user__info"]}>
                        <div className={styles["user__nickname"]}>
                            <Link to={`/${nickName}`}>{nickName}</Link>
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
                    <Link to={`/${nickName}`}>
                        <span>전환</span>
                    </Link>
                )}
            </div>
        </li>
    );
}
