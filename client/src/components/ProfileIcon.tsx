import Image from "@/assets/images/icons/icon_profile.jpg";
import styles from "@/assets/styles/ProfileIcon.module.scss";
export default function ProfileIcon() {
    return (
        <div className={styles["profile"]}>
            <img src={Image} alt="" />
        </div>
    );
}
