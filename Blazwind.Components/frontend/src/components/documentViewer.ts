export interface ImageProperties {
    width: number;
    height: number;
    mimeType: string;
    sizeBytes: number;
}

export function toggleFullscreen(element: HTMLElement) {
    if (!document.fullscreenElement) {
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if ((element as any).webkitRequestFullscreen) {
            (element as any).webkitRequestFullscreen();
        } else if ((element as any).msRequestFullscreen) {
            (element as any).msRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
            (document as any).webkitExitFullscreen();
        } else if ((document as any).msExitFullscreen) {
            (document as any).msExitFullscreen();
        }
    }
}

export async function getImageProperties(imageElement: HTMLImageElement): Promise<ImageProperties> {
    if (!imageElement) return { width: 0, height: 0, mimeType: '', sizeBytes: 0 };

    // If it's a data URL, try to guess mime type and size
    let mimeType = 'unknown';
    let sizeBytes = 0;

    if (imageElement.src.startsWith('data:')) {
        const matches = imageElement.src.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.*)$/);
        if (matches && matches.length > 2) {
            mimeType = matches[1];
            // Calculate size from base64 length
            const base64Len = matches[2].length;
            const padding = (matches[2].match(/=+$/) || [''])[0].length;
            sizeBytes = (base64Len * 3 / 4) - padding;
        }
    } else {
        // Try extension guess
        const ext = imageElement.src.split('.').pop();
        if (ext) mimeType = 'image/' + ext;

        // Try to fetch headers to get size
        try {
            const response = await fetch(imageElement.src, { method: 'HEAD' });
            const lengthHeader = response.headers.get('Content-Length');
            if (lengthHeader) {
                sizeBytes = parseInt(lengthHeader, 10);
            }
            const typeHeader = response.headers.get('Content-Type');
            if (typeHeader) {
                mimeType = typeHeader;
            }
        } catch (e) {
            console.warn("Could not fetch image size/type for: " + imageElement.src, e);
        }
    }

    return {
        width: imageElement.naturalWidth,
        height: imageElement.naturalHeight,
        mimeType: mimeType,
        sizeBytes: sizeBytes
    };
}

export async function applyImageEdits(containerOrImage: HTMLElement, rotation: number, isGrayscale: boolean) {
    return new Promise<string>((resolve, reject) => {
        let imageElement: HTMLImageElement | null = null;

        if (!containerOrImage) {
            reject("Container or Image element is null.");
            return;
        }

        if (containerOrImage.tagName === 'IMG') {
            imageElement = containerOrImage as HTMLImageElement;
        } else {
            imageElement = containerOrImage.querySelector('img');
        }

        if (!imageElement) {
            reject("Image element not found in provided container.");
            return;
        }

        // Create a new image object to ensure we handle CORS correctly
        const img = new Image();
        img.crossOrigin = "anonymous";  // This is crucial for getImageData/toDataURL

        img.onload = () => {
            try {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject("Canvas context could not be created");
                    return;
                }

                // 1. Calculate new dimensions after rotation
                const isRotated90or270 = Math.abs(rotation) % 180 === 90;
                const originalWidth = img.naturalWidth;
                const originalHeight = img.naturalHeight;

                const rotatedWidth = isRotated90or270 ? originalHeight : originalWidth;
                const rotatedHeight = isRotated90or270 ? originalWidth : originalHeight;

                canvas.width = rotatedWidth;
                canvas.height = rotatedHeight;

                // 2. Draw with transforms
                ctx.save();
                ctx.translate(canvas.width / 2, canvas.height / 2);
                ctx.rotate((rotation * Math.PI) / 180);
                if (isGrayscale) {
                    ctx.filter = 'grayscale(100%)';
                }
                ctx.drawImage(img, -originalWidth / 2, -originalHeight / 2);
                ctx.restore();

                resolve(canvas.toDataURL());
            } catch (e) {
                reject(e);
            }
        };

        img.onerror = (e) => {
            reject("Failed to load image for processing (CORS error?): " + e);
        };

        // Check if src is available
        const src = imageElement.src;
        if (!src) {
            reject("Image source is empty.");
            return;
        }

        if (src.startsWith("data:")) {
            img.src = src;
        } else {
            img.src = src;
        }
    });
}
