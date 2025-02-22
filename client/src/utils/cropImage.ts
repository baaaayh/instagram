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

            const outputSize = { width: 500, height: 500 };
            // const imageAspectRatio = image.width / image.height;
            // const outputAspectRatio = outputSize.width / outputSize.height;

            canvas.width = outputSize.width;
            canvas.height = outputSize.height;

            if (
                image.width < outputSize.width ||
                image.height < outputSize.height
            ) {
                const scaleX = outputSize.width / image.width;
                const scaleY = outputSize.height / image.height;
                const scale = Math.max(scaleX, scaleY);

                const scaledWidth = image.width * scale;
                const scaledHeight = image.height * scale;

                const offsetX = (scaledWidth - outputSize.width) / 2;
                const offsetY = (scaledHeight - outputSize.height) / 2;

                ctx?.drawImage(
                    image,
                    cropAreaPixels.x,
                    cropAreaPixels.y,
                    cropAreaPixels.width,
                    cropAreaPixels.height,
                    -offsetX,
                    -offsetY,
                    scaledWidth,
                    scaledHeight
                );
            } else {
                ctx?.drawImage(
                    image,
                    cropAreaPixels.x,
                    cropAreaPixels.y,
                    cropAreaPixels.width,
                    cropAreaPixels.height,
                    0,
                    0,
                    outputSize.width,
                    outputSize.height
                );
            }

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
