import { memo } from "react";

export default memo(function FeedSliderItem({
  image,
}: {
  image: { file_path: string; file_name: string };
}) {
  return (
    <div>
      <img src={`${image.file_path}`} alt="" />
    </div>
  );
});
