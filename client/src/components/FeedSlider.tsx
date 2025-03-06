import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import FeedSliderItem from "@/components/FeedSliderItem";
import { FeedProps } from "@/type";

export default function FeedSlider({ data }: { data: FeedProps }) {
    return (
        <Slider>
            {data.images.map((image, index) => {
                return (
                    <FeedSliderItem
                        key={`${image.file_name}-${image.file_path}-${index}`}
                        image={image}
                    />
                );
            })}
        </Slider>
    );
}
