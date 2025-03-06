import { memo } from "react";
import ExploreContent from "@/components/ExploreContent";
import styles from "@/assets/styles/Explore.module.scss";
export default memo(function Explore() {
    return (
        <div className={styles["explore"]}>
            <ExploreContent />
        </div>
    );
});
