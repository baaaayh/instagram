import { memo } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import FeedSliderItem from "@/components/FeedSliderItem";
import { FeedProps } from "@/type";

export default memo(function FeedSlider({ data }: { data: FeedProps }) {
    return (
        <Slider>
            {data.images.map((image) => (
                <FeedSliderItem key={image.file_name} image={image} />
            ))}
        </Slider>
    );
});
