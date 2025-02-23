import { useCallback, useRef, useState, useEffect, useReducer } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import Slider, { CustomArrowProps } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { v4 as uuidv4 } from "uuid";
import { useAuthStore } from "@/store/authStore";
import ModalContainer from "@/components/ModalContainer";
import CropComponent from "@/components/CropComponent";
import PostGuide from "@/assets/images/icons/icon_post_guide.svg?react";
import Arrow from "@/assets/images/icons/icon_slider_arrow.svg?react";
import Back from "@/assets/images/icons/icon_back.svg?react";
import clsx from "clsx";
import styles from "@/assets/styles/CreatePostModal.module.scss";
import ProfileIcon from "./ProfileIcon";

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

const initialState = {
    step: 0,
};

const reducer = (state: typeof initialState, action: { type: string }) => {
    switch (action.type) {
        case "NEXT_STEP":
            return { step: state.step + 1 };
        case "PREV_STEP":
            return { step: state.step - 1 };
        default:
            return state;
    }
};

export default function CreatePostModal() {
    const sliderRef = useRef<Slider | null>(null);
    const [filesURL, setFilesURL] = useState<string[]>([]);
    const cropRefs = useRef<{ [key: string]: () => void }>({});
    const [croppedImages, setCroppedImages] = useState<string[]>([]);
    const [state, dispatch] = useReducer(reducer, initialState);
    const [cropInfos, setCropInfos] = useState<{
        [key: string]: { crop: { x: number; y: number }; zoom: number };
    }>({});
    const [textArea, setTextArea] = useState("");
    const formData = useRef<HTMLFormElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { userId } = useAuthStore();

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
        dispatch({ type: "NEXT_STEP" });
    };

    const onDrop = useCallback((files: File[]) => {
        if (files.length > 0) {
            files.forEach((file) => {
                const blobURL = URL.createObjectURL(file);
                setFilesURL((prev) => [...prev, blobURL]);
            });
        }
        dispatch({ type: "NEXT_STEP" });
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        noClick: true,
        onDrop: onDrop,
    });

    const onCropComplete = useCallback(
        (imageKey: string, croppedImage: string) => {
            setCroppedImages((prev) => {
                const index = filesURL.indexOf(imageKey);
                if (index === -1) return prev;

                const updatedImages = [...prev];
                updatedImages[index] = croppedImage;
                return updatedImages;
            });
        },
        [filesURL]
    );

    const handleCropChange = useCallback(
        (image: string, crop: { x: number; y: number }, zoom: number) => {
            setCropInfos((prev) => ({
                ...prev,
                [image]: { crop, zoom },
            }));
        },
        []
    );

    const handlePrevStep = useCallback(() => {
        if (state.step === 0) {
            setCroppedImages([]);
        }
        dispatch({ type: "PREV_STEP" });
    }, [setCroppedImages, state.step]);

    useEffect(() => {
        if (state.step === 0) {
            setFilesURL([]);
        }
        if (state.step === 1) {
            setCroppedImages([]);
        }
    }, [state.step]);

    const dataURLtoFile = useCallback(
        async (dataUrl: string, extension = "jpg") => {
            const blob = await fetch(dataUrl).then((res) => res.blob());
            if (blob.size === 0) {
                console.warn("Skipping empty file");
                return null;
            }
            const uniqueFileName = `${uuidv4()}_${Date.now()}.${extension}`;
            const file = new File([blob], uniqueFileName, {
                type: "image/jpeg",
            });
            return file;
        },
        []
    );

    const handleSubmit = useCallback(
        async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            formData.delete("files");

            for (const image of croppedImages) {
                const file = await dataURLtoFile(image);
                if (file) formData.append("files", file);
            }

            try {
                const response = await axios.post("/api/feed/post", formData);
                console.log(response.data);
            } catch (error) {
                console.log(error);
            }
        },
        [croppedImages, dataURLtoFile]
    );

    return (
        <ModalContainer>
            <div
                className={clsx(styles["create-post"], {
                    [styles["create-post--active"]]: state.step === 2,
                })}
            >
                {state.step === 0 && (
                    <div className={styles["create-post__header"]}>
                        <h2>새 게시물 만들기</h2>
                    </div>
                )}
                {state.step !== 0 && (
                    <div className={styles["create-post__header"]}>
                        <div className={styles["create-post__row"]}>
                            <button
                                type="button"
                                className={styles["create-post__back"]}
                                onClick={handlePrevStep}
                            >
                                <span>
                                    <Back />
                                    이전
                                </span>
                            </button>
                            <h2>
                                {state.step !== 2
                                    ? "자르기"
                                    : "새 게시물 만들기"}
                            </h2>
                            {state.step !== 2 ? (
                                <button
                                    type="button"
                                    onClick={handleCropConfirm}
                                    className={styles["create-post__next"]}
                                >
                                    <span>다음</span>
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    className={styles["create-post__next"]}
                                    onClick={() => {
                                        if (formData.current) {
                                            formData.current.requestSubmit();
                                        }
                                    }}
                                >
                                    <span>공유하기</span>
                                </button>
                            )}
                        </div>
                    </div>
                )}
                <div
                    {...getRootProps()}
                    className={clsx(styles["create-post__body"], {
                        [styles["create-post__body--active"]]: isDragActive,
                    })}
                >
                    <div className={styles["create-post__inner"]}>
                        {state.step === 0 && (
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
                        )}
                        {state.step === 1 && (
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
                                            initialCrop={
                                                cropInfos[image]?.crop || {
                                                    x: 0,
                                                    y: 0,
                                                }
                                            }
                                            initialZoom={
                                                cropInfos[image]?.zoom || 1
                                            }
                                            onCropChange={handleCropChange}
                                        />
                                    ))}
                                </Slider>
                            </div>
                        )}
                        {state.step === 2 && (
                            <div className={styles["create-post__preview"]}>
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
                                    {croppedImages.map((image) => (
                                        <div key={image}>
                                            <img src={image} alt="preview" />
                                        </div>
                                    ))}
                                </Slider>
                            </div>
                        )}
                    </div>
                    {state.step === 2 && (
                        <div className={styles["create-post__write"]}>
                            <div className={styles["create-post__inset"]}>
                                <div className={styles["create-post__profile"]}>
                                    <div
                                        className={styles["create-post__user"]}
                                    >
                                        <span
                                            className={
                                                styles["create-post__img"]
                                            }
                                        >
                                            <ProfileIcon />
                                        </span>
                                        <span
                                            className={
                                                styles["create-post__nickname"]
                                            }
                                        >
                                            baaaayh
                                        </span>
                                    </div>
                                </div>
                                <div
                                    className={styles["create-post__textarea"]}
                                >
                                    <textarea
                                        name="text"
                                        id="text"
                                        value={textArea}
                                        onChange={(e) =>
                                            setTextArea(e.target.value)
                                        }
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <form
                    onSubmit={handleSubmit}
                    encType="multipart/form-data"
                    ref={formData}
                >
                    <input
                        {...getInputProps()}
                        type="file"
                        accept="image/jpeg,image/png,image/heic,image/heif,video/mp4,video/quicktime"
                        multiple
                        name="files"
                        ref={fileInputRef}
                    />
                    <input type="hidden" name="userId" value={userId} />
                    <input
                        type="hidden"
                        name="feedId"
                        value={`${userId}_${uuidv4()}_${Date.now()}`}
                    />
                    <input
                        type="hidden"
                        name="textAreaValue"
                        value={textArea}
                    />
                    <button type="submit" style={{ display: "none" }}></button>
                </form>
            </div>
        </ModalContainer>
    );
}
