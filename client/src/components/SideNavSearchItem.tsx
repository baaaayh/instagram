import { Link } from "react-router-dom";
import ProfileIcon from "@/components/ProfileIcon";
import { useHistoryStore } from "@/store/historyStore";
import styles from "@/assets/styles/SideNavSearchItem.module.scss";
import { UserDataProps } from "@/type";

export default function SideNavSearchItem({ data }: { data: UserDataProps }) {
    const { setHistory } = useHistoryStore();
    const { nickname, profile_image, intro } = data;
    return (
        <li>
            <div className={styles["account"]}>
                <Link
                    to={`/${nickname}`}
                    className={styles["account__inner"]}
                    onClick={() => setHistory(data)}
                >
                    <div className={styles["account__info"]}>
                        <div className={styles["account__figure"]}>
                            {profile_image ? (
                                <img src="" alt="" />
                            ) : (
                                <ProfileIcon width={44} height={44} />
                            )}
                        </div>
                        <div className={styles["account__text"]}>
                            <div className={styles["account__nickname"]}>
                                {nickname}
                            </div>
                            <div
                                className={styles["account__intro"]}
                                dangerouslySetInnerHTML={{ __html: intro }}
                            ></div>
                        </div>
                    </div>
                </Link>
            </div>
        </li>
    );
}
