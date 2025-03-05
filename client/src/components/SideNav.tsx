import { useEffect, memo } from "react";
import SmallLogo from "@/components/SmallLogo";
import SideNavMenu from "@/components/SideNavMenu";
import SideNavSearch from "@/components/SideNavSearch";
import { useNavStore } from "@/store/navStore";
import clsx from "clsx";
import styles from "@/assets/styles/SideNav.module.scss";

export default memo(function SideNav() {
    const { isOpenNavPanel, setCloseNavSearch } = useNavStore();

    useEffect(() => {
        function checkParentElement(e: MouseEvent) {
            if (e.target instanceof HTMLElement) {
                if (
                    e.target.closest(".view") &&
                    !e.target.closest(".side-nav")
                ) {
                    setCloseNavSearch();
                }
            }
        }

        document.addEventListener("click", checkParentElement);

        return () => {
            document.removeEventListener("click", checkParentElement);
        };
    }, [setCloseNavSearch]);

    return (
        <div
            className={clsx(styles["nav-container"], {
                [styles["nav-container--active"]]: isOpenNavPanel,
            })}
        >
            <nav className={`side-nav ${styles["side-nav"]}`}>
                <div className={styles["side-nav__inner"]}>
                    <SmallLogo navState={isOpenNavPanel} />
                    <SideNavMenu navState={isOpenNavPanel} />
                </div>
            </nav>
            <SideNavSearch navState={isOpenNavPanel} />
        </div>
    );
});
