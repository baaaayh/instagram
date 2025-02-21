import { memo } from "react";
import SideNavMenuItem from "@/components/SideNavMenuItem";
import styles from "@/assets/styles/SideNavMenu.module.scss";
import Home from "@/assets/images/icons/icon_home.svg?react";
import Search from "@/assets/images/icons/icon_search.svg?react";
import Explorer from "@/assets/images/icons/icon_explore.svg?react";
import Reels from "@/assets/images/icons/icon_reels.svg?react";
import Message from "@/assets/images/icons/icon_message.svg?react";
import Heart from "@/assets/images/icons/icon_heart.svg?react";
import Plus from "@/assets/images/icons/icon_plus.svg?react";
import ProfileIcon from "@/components/ProfileIcon";

export default memo(function SideNavMenu() {
    return (
        <div className={styles["menu"]}>
            <div className={styles["menu__inner"]}>
                <ul>
                    <SideNavMenuItem link={"/"} icon={<Home />} title="홈" />
                    <SideNavMenuItem
                        link={"/"}
                        icon={<Search />}
                        title="검색"
                    />
                    <SideNavMenuItem
                        link={"/"}
                        icon={<Explorer />}
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
                        link={"/"}
                        icon={<Plus />}
                        title="만들기"
                    />
                    <SideNavMenuItem
                        link={"/"}
                        icon={<ProfileIcon />}
                        title="프로필"
                    />
                </ul>
            </div>
        </div>
    );
});
