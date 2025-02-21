import { memo } from "react";
import { Link } from "react-router-dom";
import styles from "@/assets/styles/SideNavMenu.module.scss";

export default memo(function SideNavMenuItem({
    link,
    title,
    icon,
}: {
    link: string;
    title: string;
    icon: React.ReactElement;
}) {
    return (
        <li className={styles["menu__item"]}>
            <Link to={link} className={styles["menu__link"]}>
                <div className={styles["menu__row"]}>
                    <span className={styles["menu__icon"]}>{icon}</span>
                    <span className={styles["menu__text"]}>{title}</span>
                </div>
            </Link>
        </li>
    );
});
