import { memo } from "react";
import SideNavMenuItem from "@/components/SideNavMenuItem";
import styles from "@/assets/styles/SideNavMenu.module.scss";
import Home from "@/assets/images/icons/icon_home.svg?react";
import HomeActive from "@/assets/images/icons/icon_home_on.svg?react";
import Search from "@/assets/images/icons/icon_search.svg?react";
import SearchOn from "@/assets/images/icons/icon_search_on.svg?react";
import Explorer from "@/assets/images/icons/icon_explore.svg?react";
import ExplorerOn from "@/assets/images/icons/icon_explore_on.svg?react";
import Plus from "@/assets/images/icons/icon_plus.svg?react";
import ProfileIcon from "@/components/ProfileIcon";
import Hamburger from "@/assets/images/icons/icon_hamburger.svg?react";
import { useAuthStore } from "@/store/authStore";
import { useModalStore } from "@/store/modalStore";
import { useNavStore } from "@/store/navStore";
import { useWindowSizeStore } from "@/store/windowSizeStore";
import clsx from "clsx";

export default memo(function SideNavMenu({ navState }: { navState: boolean }) {
    const { setOpenPostModal } = useModalStore();
    const {
        setToggleNavSearch,
        setCloseMoreMenu,
        isOpenMoreMenu,
        setToggleMoreMenu,
    } = useNavStore();
    const { userNickName, resetTokenState } = useAuthStore();
    const { width: windowWidth } = useWindowSizeStore();

    const navMenuData = [
        { link: "/", icon: <Home />, activeIcon: <HomeActive />, title: "홈" },
        {
            icon: <Search />,
            activeIcon: <SearchOn />,
            title: "검색",
            action: setToggleNavSearch,
            hidden: windowWidth <= 765,
        },
        {
            link: "/explore",
            icon: <Explorer />,
            activeIcon: <ExplorerOn />,
            title: "탐색",
        },
        { action: setOpenPostModal, icon: <Plus />, title: "만들기" },
        {
            link: `/${userNickName}`,
            icon: <ProfileIcon width={24} height={24} />,
            title: "프로필",
        },
    ];

    return (
        <div
            className={clsx(styles.menu, {
                [styles["menu--active"]]: navState,
            })}
        >
            <div className={styles.menu__inner}>
                <ul>
                    {navMenuData.map(
                        ({ link, icon, activeIcon, title, action, hidden }) =>
                            !hidden && (
                                <SideNavMenuItem
                                    key={title}
                                    link={link}
                                    icon={icon}
                                    activeIcon={activeIcon}
                                    title={title}
                                    handleAction={action}
                                />
                            )
                    )}
                </ul>
            </div>
            {windowWidth > 765 && (
                <div className={styles.menu__more}>
                    {isOpenMoreMenu && (
                        <div className={styles.menu__float}>
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
                        className={styles.menu__toggle}
                    >
                        <Hamburger />
                        <strong>더 보기</strong>
                    </button>
                </div>
            )}
        </div>
    );
});
