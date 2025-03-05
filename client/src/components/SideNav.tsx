import { useEffect, memo } from "react";
import SmallLogo from "@/components/SmallLogo";
import SideNavMenu from "@/components/SideNavMenu";
import SideNavSearch from "@/components/SideNavSearch";
import { useNavStore } from "@/store/navStore";
import clsx from "clsx";
import styles from "@/assets/styles/SideNav.module.scss";

export default memo(function SideNav() {
    const { isWideNav, isOpenNavSearch, setCloseNavSearch, setCloseMoreMenu } =
        useNavStore();

    useEffect(() => {
        function checkParentElement(e: MouseEvent) {
            if (e.target instanceof HTMLElement) {
                if (
                    e.target.closest(".view") &&
                    !e.target.closest(".side-nav")
                ) {
                    setCloseNavSearch();
                    setCloseMoreMenu();
                }
            }
        }

        document.addEventListener("click", checkParentElement);

        return () => {
            document.removeEventListener("click", checkParentElement);
        };
    }, [setCloseNavSearch, setCloseMoreMenu]);

    return (
        <div
            className={clsx(styles["nav-container"], {
                [styles["nav-container--active"]]: isWideNav,
            })}
        >
            <nav className={`side-nav ${styles["side-nav"]}`}>
                <div className={styles["side-nav__inner"]}>
                    <SmallLogo navState={isWideNav} />
                    <SideNavMenu navState={isWideNav} />
                </div>
            </nav>
            <SideNavSearch navState={isOpenNavSearch} />
        </div>
    );
});
