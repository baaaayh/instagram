import { memo } from "react";
import FeedSlider from "@/components/FeedSlider";
import styles from "@/assets/styles/FeedBody.module.scss";
import { FeedProps } from "@/type";

export default memo(function FeedBody({ data }: { data: FeedProps }) {
    return (
        <div>
            <div className={styles["feed-body"]}>
                <div className={styles["feed-body__inner"]}>
                    {data.images.length <= 1 ? (
                        <div key={data.images[0].file_name}>
                            <img
                                src={`${import.meta.env.VITE_PUBLIC_URL}${
                                    data.images[0].file_path
                                }`}
                                alt=""
                            />
                        </div>
                    ) : (
                        <FeedSlider data={data} />
                    )}
                </div>
            </div>
        </div>
    );
});
