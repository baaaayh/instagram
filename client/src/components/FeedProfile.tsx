import ProfileIcon from "@/components/ProfileIcon";
import styles from "@/assets/styles/FeedProfile.module.scss";

export default function FeedProfile({ profile }: { profile: string | null }) {
    return (
        <div className={styles["profile-icon"]}>
            <span className={styles["profile-icon__inner"]}>
                {profile ? (
                    <img src={profile} alt="" />
                ) : (
                    <ProfileIcon width={32} height={32} />
                )}
            </span>
        </div>
    );
}
