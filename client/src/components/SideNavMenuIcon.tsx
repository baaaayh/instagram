import { memo } from "react";
import styles from "@/assets/styles/SideNavMenu.module.scss";

export default memo(function SideNavMenuIcon({
    title,
    icon,
}: {
    title: string;
    icon: React.ReactElement;
}) {
    return (
        <div className={styles["menu__row"]}>
            <span className={styles["menu__icon"]}>{icon}</span>
            <span className={styles["menu__text"]}>{title}</span>
        </div>
    );
});
