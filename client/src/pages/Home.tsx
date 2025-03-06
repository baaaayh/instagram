import { memo, lazy, Suspense } from "react";
import HomeContents from "@/components/HomeContents";
const SideBar = lazy(() => import("@/components/SideBar"));
const SpinnerComponent = lazy(() => import("@/components/SpinnerComponent"));
import { useWindowSizeStore } from "@/store/windowSizeStore";
import styles from "@/assets/styles/Home.module.scss";
export default memo(function Home() {
    const { width: windowWidth } = useWindowSizeStore();
    return (
        <>
            <div className={styles["home"]}>
                <div className={styles["home__inner"]}>
                    <HomeContents />
                    {windowWidth > 1160 && (
                        <Suspense fallback={<SpinnerComponent />}>
                            <SideBar />
                        </Suspense>
                    )}
                </div>
            </div>
        </>
    );
});
