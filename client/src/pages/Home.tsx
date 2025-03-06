import HomeContents from "@/components/HomeContents";
import SideBar from "@/components/SideBar";
import { useWindowSizeStore } from "@/store/windowSizeStore";
import styles from "@/assets/styles/Home.module.scss";
export default function Home() {
    const { width: windowWidth } = useWindowSizeStore();
    return (
        <>
            <div className={styles["home"]}>
                <HomeContents />
                {windowWidth > 1160 && <SideBar />}
            </div>
        </>
    );
}
