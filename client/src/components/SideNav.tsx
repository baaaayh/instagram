import { memo } from "react";
import SmallLogo from "@/components/SmallLogo";
import styles from "@/assets/styles/SideNav.module.scss";

export default memo(function SideNav() {
    return (
        <nav className={styles["side-nav"]}>
            <div className={styles["side-nav__inner"]}>
                <SmallLogo />
            </div>
        </nav>
    );
});
