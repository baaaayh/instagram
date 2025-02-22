import { useState, useEffect, useRef, useCallback, memo } from "react";
import styles from "@/assets/styles/CropComponent.module.scss";
import Cropper from "react-easy-crop";
import getCroppedImg from "@/utils/cropImage";
import Zoom from "@/assets/images/icons/icon_zoom.svg?react";

export default memo(function CropComponent({
    image,
    onCropComplete,
    setCropFunction,
}: {
    image: string;
    onCropComplete: (image: string, croppedImage: string) => void;
    setCropFunction: (image: string, func: () => void) => void;
}) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<{
        x: number;
        y: number;
        width: number;
        height: number;
    } | null>(null);

    const onCropChange = (crop: { x: number; y: number }) => setCrop(crop);
    const onZoomChange = (zoom: number) => {
        setZoom(Number(zoom));
    };

    const onCropCompleteHandler = useCallback(
        (
            _: {
                x: number;
                y: number;
                width: number;
                height: number;
            },
            croppedAreaPixels: {
                x: number;
                y: number;
                width: number;
                height: number;
            }
        ) => {
            setCroppedAreaPixels(croppedAreaPixels);
        },
        []
    );

    const handleCropDone = useCallback(async () => {
        if (croppedAreaPixels === null) return;
        const croppedImage = await getCroppedImg(image, croppedAreaPixels);
        if (!croppedImage) return;
        onCropComplete(image, croppedImage);
    }, [onCropComplete, image, croppedAreaPixels]);

    useEffect(() => {
        setCropFunction(image, handleCropDone);
    }, [image, handleCropDone, setCropFunction]);

    useEffect(() => {
        const updateSize = () => {
            if (containerRef.current) {
                setContainerSize({
                    width: containerRef.current.offsetWidth,
                    height: containerRef.current.offsetHeight,
                });
            }
        };
        updateSize();

        window.addEventListener("resize", updateSize);
        return () => window.removeEventListener("resize", updateSize);
    }, []);

    return (
        <div className={styles["crop-container"]} ref={containerRef}>
            <Cropper
                image={image}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={onCropChange}
                onZoomChange={onZoomChange}
                onCropComplete={onCropCompleteHandler}
                objectFit="cover"
                cropSize={{
                    width: containerSize.width,
                    height: containerSize.height,
                }}
            />
            <div className={styles["controls"]}>
                <div className={styles["controls__zoom"]}>
                    <button type="button">
                        <span>
                            <Zoom />
                        </span>
                    </button>
                    <div className={styles["controls__panel"]}>
                        <input
                            type="range"
                            value={zoom}
                            onChange={(e) =>
                                onZoomChange(Number(e.target.value))
                            }
                            min={1}
                            max={2}
                            step={0.05}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
});
