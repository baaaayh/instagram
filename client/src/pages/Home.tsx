import HomeContents from "@/components/HomeContents";
import SideBar from "@/components/SideBar";
import styles from "@/assets/styles/Home.module.scss";
export default function Home() {
    return (
        <>
            <div className={styles["home"]}>
                <HomeContents />
                <SideBar />
            </div>
        </>
    );
}
