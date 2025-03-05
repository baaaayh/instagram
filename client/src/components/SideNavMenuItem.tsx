import { Dispatch, memo } from "react";
import { NavLink } from "react-router-dom";
import SideNavMenuIcon from "@/components/SideNavMenuIcon";
import { useNavStore } from "@/store/navStore";
import styles from "@/assets/styles/SideNavMenu.module.scss";

interface SideNavMenuItemProps {
    link?: string;
    title: string;
    handleAction?: () => void;
    icon: React.ReactElement;
    activeIcon?: React.ReactElement;
    setToggleNavSearch?: Dispatch<React.SetStateAction<boolean>>;
}

const SideNavMenuItem = memo(function SideNavMenuItem({
    link,
    title,
    handleAction,
    icon,
    activeIcon,
    setToggleNavSearch,
}: SideNavMenuItemProps) {
    const { isWideNav } = useNavStore();
    return (
        <li className={styles["menu__item"]}>
            {link ? (
                <NavLink
                    to={link}
                    className={({ isActive }) =>
                        `${styles["menu__link"]} ${
                            isActive ? styles["menu__link--active"] : ""
                        }`
                    }
                >
                    {({ isActive }) => (
                        <SideNavMenuIcon
                            title={title}
                            icon={
                                !isWideNav && isActive && activeIcon
                                    ? activeIcon
                                    : icon
                            }
                        />
                    )}
                </NavLink>
            ) : (
                <NavLink
                    to={""}
                    type="button"
                    className={styles["menu__link"]}
                    onClick={() => {
                        handleAction?.();
                        setToggleNavSearch?.((prev) => !prev);
                    }}
                >
                    <SideNavMenuIcon
                        title={title}
                        icon={isWideNav && activeIcon ? activeIcon : icon}
                    />
                </NavLink>
            )}
        </li>
    );
});

export default SideNavMenuItem;
