import { memo } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
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
                        <Slider>
                            {data.images.map((image) => (
                                <div key={image.file_name}>
                                    <img
                                        src={`${
                                            import.meta.env.VITE_PUBLIC_URL
                                        }${image.file_path}`}
                                        alt=""
                                    />
                                </div>
                            ))}
                        </Slider>
                    )}
                </div>
            </div>
        </div>
    );
});
