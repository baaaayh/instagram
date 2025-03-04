import { useState, memo } from "react";
import SmallLogo from "@/components/SmallLogo";
import SideNavMenu from "@/components/SideNavMenu";
import SideNavSearch from "@/components/SideNavSearch";
import clsx from "clsx";
import styles from "@/assets/styles/SideNav.module.scss";

export default memo(function SideNav() {
    const [navState, setNavState] = useState(false);

    return (
        <div
            className={clsx(styles["nav-container"], {
                [styles["nav-container--active"]]: navState,
            })}
        >
            <nav className={styles["side-nav"]}>
                <div className={styles["side-nav__inner"]}>
                    <SmallLogo navState={navState} />
                    <SideNavMenu
                        navState={navState}
                        setNavState={setNavState}
                    />
                </div>
            </nav>
            <SideNavSearch navState={navState} />
        </div>
    );
});
