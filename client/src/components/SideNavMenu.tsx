import { memo } from "react";
import SideNavMenuItem from "@/components/SideNavMenuItem";
import styles from "@/assets/styles/SideNavMenu.module.scss";
import Home from "@/assets/images/icons/icon_home.svg?react";
import HomeActive from "@/assets/images/icons/icon_home_on.svg?react";
import Search from "@/assets/images/icons/icon_search.svg?react";
import SearchOn from "@/assets/images/icons/icon_search_on.svg?react";
import Explorer from "@/assets/images/icons/icon_explore.svg?react";
import ExplorerOn from "@/assets/images/icons/icon_explore_on.svg?react";
import Reels from "@/assets/images/icons/icon_reels.svg?react";
import Message from "@/assets/images/icons/icon_message.svg?react";
import Heart from "@/assets/images/icons/icon_heart.svg?react";
import Plus from "@/assets/images/icons/icon_plus.svg?react";
import ProfileIcon from "@/components/ProfileIcon";
import Hamburger from "@/assets/images/icons/icon_hamburger.svg?react";
import { useAuthStore } from "@/store/authStore";
import { useModalStore } from "@/store/modalStore";
import { useNavStore } from "@/store/navStore";
import clsx from "clsx";

export default memo(function SideNavMenu({ navState }: { navState: boolean }) {
    const { setOpenPostModal } = useModalStore();
    const {
        setToggleNavSearch,
        setCloseMoreMenu,
        isOpenMoreMenu,
        setToggleMoreMenu,
    } = useNavStore();
    const { resetTokenState } = useAuthStore();

    return (
        <div
            className={clsx(styles["menu"], {
                [styles["menu--active"]]: navState,
            })}
        >
            <div className={styles["menu__inner"]}>
                <ul>
                    <SideNavMenuItem
                        link={"/"}
                        icon={<Home />}
                        activeIcon={<HomeActive />}
                        title="홈"
                    />
                    <SideNavMenuItem
                        icon={<Search />}
                        title="검색"
                        setToggleNavSearch={setToggleNavSearch}
                        activeIcon={<SearchOn />}
                    />
                    <SideNavMenuItem
                        link={"/explore"}
                        icon={<Explorer />}
                        activeIcon={<ExplorerOn />}
                        title="탐색"
                    />
                    <SideNavMenuItem link={"/"} icon={<Reels />} title="릴스" />
                    <SideNavMenuItem
                        link={"/"}
                        icon={<Message />}
                        title="메시지"
                    />
                    <SideNavMenuItem link={"/"} icon={<Heart />} title="알림" />
                    <SideNavMenuItem
                        handleAction={setOpenPostModal}
                        icon={<Plus />}
                        title="만들기"
                    />
                    <SideNavMenuItem
                        link={"/"}
                        icon={<ProfileIcon width={24} height={24} />}
                        title="프로필"
                    />
                </ul>
            </div>
            <div className={styles["menu__more"]}>
                {isOpenMoreMenu && (
                    <div className={styles["menu__float"]}>
                        <ul>
                            <li>
                                <button
                                    type="button"
                                    onClick={() => {
                                        resetTokenState();
                                        setCloseMoreMenu();
                                    }}
                                >
                                    <span>로그아웃</span>
                                </button>
                            </li>
                        </ul>
                    </div>
                )}
                <button
                    type="button"
                    onClick={setToggleMoreMenu}
                    className={styles["menu__toggle"]}
                >
                    <Hamburger />
                    <strong>더 보기</strong>
                </button>
            </div>
        </div>
    );
});
