export default function FeedSliderItem({
    image,
}: {
    image: { file_path: string; file_name: string };
}) {
    return (
        <div key={image.file_name}>
            <img
                src={`${import.meta.env.VITE_PUBLIC_URL}${image.file_path}`}
                alt=""
            />
        </div>
    );
}
