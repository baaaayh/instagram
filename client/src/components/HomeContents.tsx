import UpdateList from "@/components/UpdateList";
import FeedList from "@/components/FeedList";
import styles from "@/assets/styles/HomeContents.module.scss";
export default function HomeContents() {
    return (
        <div className={styles["home-contents"]}>
            <UpdateList />
            <FeedList />
        </div>
    );
}
