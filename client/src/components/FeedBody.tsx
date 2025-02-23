import { memo } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "@/assets/styles/FeedBody.module.scss";
import { FeedProps } from "@/components/FeedList";
export default memo(function FeedBody({ data }: { data: FeedProps }) {
    console.log(import.meta.env.VITE_PUBLIC_URL);
    return (
        <div>
            <div className={styles["feed-body"]}>
                <div className={styles["feed-body__inner"]}>
                    <Slider>
                        {data.images.map((image) => (
                            <div key={image.file_name}>
                                <img
                                    src={`${import.meta.env.VITE_PUBLIC_URL}${
                                        image.file_path
                                    }`}
                                    alt=""
                                />
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>
        </div>
    );
});
