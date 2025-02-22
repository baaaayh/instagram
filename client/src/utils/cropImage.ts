export default async function getCroppedImg(
    imageSrc: string,
    cropAreaPixels: { x: number; y: number; width: number; height: number }
): Promise<string | null> {
    return new Promise((resolve) => {
        const image = new Image();
        image.src = imageSrc;
        image.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            const outputSize = { width: 1024, height: 1024 };
            const outputAspectRatio = outputSize.width / outputSize.height;

            // 크롭 영역의 비율 계산
            const cropAspectRatio =
                cropAreaPixels.width / cropAreaPixels.height;

            let drawWidth,
                drawHeight,
                offsetX = 0,
                offsetY = 0;

            if (cropAspectRatio > outputAspectRatio) {
                // 크롭 영역이 더 넓은 경우
                drawWidth = outputSize.width;
                drawHeight = drawWidth / cropAspectRatio;
            } else {
                // 크롭 영역이 더 높은 경우
                drawHeight = outputSize.height;
                drawWidth = drawHeight * cropAspectRatio;
            }

            // 캔버스 크기 설정
            canvas.width = outputSize.width;
            canvas.height = outputSize.height;

            // 중앙 정렬을 위한 오프셋 계산
            offsetX = (outputSize.width - drawWidth) / 2;
            offsetY = (outputSize.height - drawHeight) / 2;

            ctx?.drawImage(
                image,
                cropAreaPixels.x,
                cropAreaPixels.y,
                cropAreaPixels.width,
                cropAreaPixels.height,
                offsetX,
                offsetY,
                drawWidth,
                drawHeight
            );

            canvas.toBlob((blob) => {
                if (blob) {
                    resolve(URL.createObjectURL(blob));
                } else {
                    resolve(null);
                }
            }, "image/jpeg");
        };
    });
}
