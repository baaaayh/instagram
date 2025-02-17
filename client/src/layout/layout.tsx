import { Outlet } from "react-router-dom";
import styles from "@/assets/styles/Layout.module.scss";

export default function Layout() {
    return (
        <div className={styles["container"]}>
            <Outlet />
        </div>
    );
}
