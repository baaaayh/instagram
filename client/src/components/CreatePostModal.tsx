import { useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import Slider, { CustomArrowProps } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ModalContainer from "@/components/ModalContainer";
import CropComponent from "@/components/CropComponent";
import PostGuide from "@/assets/images/icons/icon_post_guide.svg?react";
import Arrow from "@/assets/images/icons/icon_slider_arrow.svg?react";
import clsx from "clsx";
import styles from "@/assets/styles/CreatePostModal.module.scss";

export interface CroppedAreaType {
    x: number;
    y: number;
    width: number;
    height: number;
}

export function PrevArrow({ onClick, className }: CustomArrowProps) {
    return (
        <button
            type="button"
            className={`${styles["create-post__arrow"]} ${styles["create-post__prev"]} ${className}`}
            onClick={onClick}
        >
            <Arrow />
            PREV
        </button>
    );
}

export function NextArrow({ onClick, className }: CustomArrowProps) {
    return (
        <button
            type="button"
            className={`${styles["create-post__arrow"]} ${styles["create-post__next"]} ${className}`}
            onClick={onClick}
        >
            <Arrow />
            NEXT
        </button>
    );
}

export default function CreatePostModal() {
    const sliderRef = useRef<Slider | null>(null);
    const [filesURL, setFilesURL] = useState<string[]>([]);
    const cropRefs = useRef<{ [key: string]: () => void }>({});

    const setCropFunction = (image: string, func: () => void) => {
        cropRefs.current[image] = func;
    };

    const handleCropConfirm = () => {
        if (filesURL.length <= 0) return;
        filesURL.forEach((fileURL) => {
            if (cropRefs.current[fileURL]) {
                cropRefs.current[fileURL]();
            }
        });
    };

    const onDrop = useCallback((files: File[]) => {
        if (files.length > 0) {
            files.forEach((file) => {
                const blobURL = URL.createObjectURL(file);
                setFilesURL((prev) => [...prev, blobURL]);
            });
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        noClick: true,
        onDrop: onDrop,
    });

    const onCropComplete = (_: string, croppedImage: string) => {
        console.log(croppedImage);
    };

    return (
        <ModalContainer>
            <div className={styles["create-post"]}>
                {filesURL.length <= 0 ? (
                    <div className={styles["create-post__header"]}>
                        <h2>새 게시물 만들기</h2>
                    </div>
                ) : (
                    <div className={styles["create-post__header"]}>
                        <button type="button">
                            <span>이전</span>
                        </button>
                        <div className={styles["create-post__row"]}>
                            <h2>자르기</h2>
                        </div>
                        <button type="button" onClick={handleCropConfirm}>
                            <span>다음</span>
                        </button>
                    </div>
                )}
                <div
                    {...getRootProps()}
                    className={clsx(styles["create-post__body"], {
                        [styles["create-post__body--active"]]: isDragActive,
                    })}
                >
                    <div className={styles["create-post__inner"]}>
                        {filesURL.length <= 0 ? (
                            <div className={styles["create-post__guide"]}>
                                <div className={styles["create-post__icon"]}>
                                    <PostGuide />
                                </div>
                                <p>사진과 동영상을 여기에 끌어다 놓으세요</p>
                                <div className={styles["create-post__button"]}>
                                    <button
                                        type="button"
                                        className="btn btn-round btn-round--blue btn-round--pd10 active"
                                        style={{ cursor: "pointer" }}
                                    >
                                        <span>컴퓨터에서 선택</span>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className={styles["create-post__modify"]}>
                                <Slider
                                    dots
                                    arrows
                                    infinite={false}
                                    speed={0}
                                    slidesToShow={1}
                                    slidesToScroll={1}
                                    draggable={false}
                                    ref={sliderRef}
                                    prevArrow={<PrevArrow />}
                                    nextArrow={<NextArrow />}
                                >
                                    {filesURL.map((image) => (
                                        <CropComponent
                                            key={image}
                                            image={image}
                                            onCropComplete={onCropComplete}
                                            setCropFunction={setCropFunction}
                                        />
                                    ))}
                                </Slider>
                            </div>
                        )}

                        <form action="">
                            <input
                                {...getInputProps()}
                                type="file"
                                accept="image/jpeg,image/png,image/heic,image/heif,video/mp4,video/quicktime"
                                multiple
                            />
                        </form>
                    </div>
                </div>
            </div>
        </ModalContainer>
    );
}
