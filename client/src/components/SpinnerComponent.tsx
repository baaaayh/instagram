import { memo } from "react";
import styles from "@/assets/styles/SpinnerComponent.module.scss";

export default memo(function SpinnerComponent() {
    return (
        <div className={styles["spinner"]}>
            <img src="/images/icons/icon_spinner.gif" alt="Loading spinner" />
        </div>
    );
});
