import { Link } from "react-router-dom";
import clsx from "clsx";
import Logo from "@/assets/images/common/small_logo.svg?react";
import InstagramIcon from "@/assets/images/icons/icon_instagram.svg?react";
import styles from "@/assets/styles/SmallLogo.module.scss";

export default function SmallLogo({ navState }: { navState: boolean }) {
    return (
        <h1
            className={clsx(styles["small-logo"], {
                [styles["small-logo--active"]]: navState,
            })}
        >
            <Link to="/">{navState ? <InstagramIcon /> : <Logo />}</Link>
        </h1>
    );
}
