import Image from "@/assets/images/icons/icon_profile.jpg";
import styles from "@/assets/styles/ProfileIcon.module.scss";
export default function ProfileIcon({
    width,
    height,
}: {
    width: number;
    height: number;
}) {
    return (
        <div className={styles["profile"]} style={{ width, height }}>
            <img src={Image} alt="" />
        </div>
    );
}
