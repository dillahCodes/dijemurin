/**
 * Convert image URL to ESC/POS (GS v 0) command bytes
 */
export async function convertImageToEscPosSharp(
    imageUrl: string,
    maxWidth: number = 384,
    gamma: number = 0.6,
): Promise<Uint8Array> {
    const image = await loadImage(imageUrl);

    const { width, height } = calculateScaledSize(image, maxWidth);
    const canvas = createCanvas(width, height);

    const ctx = getCanvasContext(canvas);
    drawImageToCanvas(ctx, image, width, height);

    const imageData = ctx.getImageData(0, 0, width, height);

    const luminance = applyGammaCorrection(imageData.data, gamma, width, height);
    const monochrome = applyFloydSteinbergDithering(luminance, width, height);

    return buildEscPosCommand(monochrome, width, height);
}

/* -------------------------------------------------------------------------- */
/*                                   HELPERS                                  */
/* -------------------------------------------------------------------------- */

function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = src;

        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    });
}

function calculateScaledSize(img: HTMLImageElement, maxWidth: number): { width: number; height: number } {
    let width = img.width;
    let height = img.height;

    if (width > maxWidth) {
        const ratio = maxWidth / width;
        width = maxWidth;
        height = Math.round(height * ratio);
    }

    // Ensure width multiple of 8
    width = Math.ceil(width / 8) * 8;

    return { width, height };
}

function createCanvas(width: number, height: number): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    return canvas;
}

function getCanvasContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        throw new Error('Canvas 2D context not supported');
    }

    return ctx;
}

function drawImageToCanvas(ctx: CanvasRenderingContext2D, img: HTMLImageElement, width: number, height: number): void {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);
}

function applyGammaCorrection(rgba: Uint8ClampedArray, gamma: number, width: number, height: number): Float32Array {
    const luminance = new Float32Array(width * height);

    for (let i = 0; i < rgba.length; i += 4) {
        const r = rgba[i];
        const g = rgba[i + 1];
        const b = rgba[i + 2];
        const a = rgba[i + 3];

        if (a < 128) {
            luminance[i / 4] = 255;
            continue;
        }

        const luma = 0.299 * r + 0.587 * g + 0.114 * b;
        luminance[i / 4] = 255 * Math.pow(luma / 255, gamma);
    }

    return luminance;
}

function applyFloydSteinbergDithering(luminance: Float32Array, width: number, height: number): Uint8Array {
    const result = new Uint8Array(width * height);

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const index = y * width + x;

            const oldPixel = luminance[index];
            const isBlack = oldPixel < 128;
            const newPixel = isBlack ? 0 : 255;

            result[index] = isBlack ? 1 : 0;

            const error = oldPixel - newPixel;

            distributeError(luminance, error, x, y, width, height);
        }
    }

    return result;
}

function distributeError(buffer: Float32Array, error: number, x: number, y: number, width: number, height: number): void {
    const index = y * width + x;

    if (x + 1 < width) {
        buffer[index + 1] += error * 0.4375;
    }

    if (y + 1 < height) {
        if (x > 0) {
            buffer[index + width - 1] += error * 0.1875;
        }

        buffer[index + width] += error * 0.3125;

        if (x + 1 < width) {
            buffer[index + width + 1] += error * 0.0625;
        }
    }
}

function buildEscPosCommand(pixels: Uint8Array, width: number, height: number): Uint8Array {
    const widthBytes = width / 8;

    const header = new Uint8Array([
        0x1d,
        0x76,
        0x30,
        0x00,
        widthBytes & 0xff,
        (widthBytes >> 8) & 0xff,
        height & 0xff,
        (height >> 8) & 0xff,
    ]);

    const imageBytes = packPixelsToBytes(pixels, width, height, widthBytes);

    const result = new Uint8Array(header.length + imageBytes.length);
    result.set(header);
    result.set(imageBytes, header.length);

    return result;
}

function packPixelsToBytes(pixels: Uint8Array, width: number, height: number, widthBytes: number): Uint8Array {
    const bytes = new Uint8Array(widthBytes * height);
    let byteIndex = 0;

    for (let y = 0; y < height; y++) {
        for (let xb = 0; xb < widthBytes; xb++) {
            let byte = 0;

            for (let bit = 0; bit < 8; bit++) {
                const x = xb * 8 + bit;
                const index = y * width + x;

                if (x < width && pixels[index] === 1) {
                    byte |= 1 << (7 - bit);
                }
            }

            bytes[byteIndex++] = byte;
        }
    }

    return bytes;
}
