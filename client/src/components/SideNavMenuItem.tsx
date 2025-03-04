import { Dispatch, memo } from "react";
import { Link } from "react-router-dom";
import SideNavMenuIcon from "@/components/SideNavMenuIcon";
import styles from "@/assets/styles/SideNavMenu.module.scss";

export default memo(function SideNavMenuItem({
    link,
    title,
    handleAction,
    icon,
    setNavState,
}: {
    link?: string;
    title: string;
    handleAction?: () => void;
    icon: React.ReactElement;
    setNavState?: Dispatch<React.SetStateAction<boolean>>;
}) {
    return (
        <li className={styles["menu__item"]}>
            {link ? (
                <Link to={link} className={styles["menu__link"]}>
                    <SideNavMenuIcon title={title} icon={icon} />
                </Link>
            ) : (
                <button
                    type="button"
                    className={styles["menu__link"]}
                    onClick={() => {
                        handleAction?.();
                        setNavState?.((prev) => !prev);
                    }}
                >
                    <SideNavMenuIcon title={title} icon={icon} />
                </button>
            )}
        </li>
    );
});
