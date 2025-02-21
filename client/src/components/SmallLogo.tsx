import { Link } from "react-router-dom";
import styles from "@/assets/styles/SmallLogo.module.scss";
import Logo from "@/assets/images/common/small_logo.svg?react";

export default function SmallLogo() {
    return (
        <h1 className={styles["small-logo"]}>
            <Link to="/">
                <Logo />
            </Link>
        </h1>
    );
}
