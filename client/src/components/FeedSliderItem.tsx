import { memo } from "react";

export default memo(function FeedSliderItem({
    image,
}: {
    image: { file_path: string; file_name: string };
}) {
    return (
        <div>
            <img
                src={`${import.meta.env.VITE_PUBLIC_URL}${image.file_path}`}
                alt=""
            />
        </div>
    );
});
