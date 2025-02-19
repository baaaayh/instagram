import { Link } from "react-router-dom";
import styles from "@/assets/styles/SmallLogo.module.scss";
export default function SmallLogo() {
    return (
        <h1 className={styles["small-logo"]}>
            <Link to="/">SmallLogo</Link>
        </h1>
    );
}
