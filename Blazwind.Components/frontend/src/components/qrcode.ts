/**
 * QRCode Module - QR code generation using qrcode library
 */

import QRCode from 'qrcode';

export async function generateToCanvas(
    elementId: string,
    value: string,
    options: {
        width?: number;
        margin?: number;
        color?: {
            dark?: string;
            light?: string;
        };
        errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
    } = {}
): Promise<void> {
    const element = document.getElementById(elementId);
    if (!element) return;

    // Find the existing canvas (created by Blazor)
    const canvas = element.querySelector('canvas.bw-qr-canvas') as HTMLCanvasElement;
    if (!canvas) return;

    // Hide loading indicator if present
    const loading = element.querySelector('.bw-qr-loading') as HTMLElement;
    if (loading) loading.style.display = 'none';

    // Show canvas
    canvas.style.display = '';

    try {
        await QRCode.toCanvas(canvas, value, {
            width: options.width || 200,
            margin: options.margin || 2,
            color: {
                dark: options.color?.dark || '#000000',
                light: options.color?.light || '#ffffff'
            },
            errorCorrectionLevel: options.errorCorrectionLevel || 'M'
        });
    } catch (err) {
        console.error('QR Code generation failed:', err);
    }
}

export async function generateToDataURL(
    value: string,
    options: {
        width?: number;
        margin?: number;
        color?: {
            dark?: string;
            light?: string;
        };
        errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
    } = {}
): Promise<string> {
    try {
        return await QRCode.toDataURL(value, {
            width: options.width || 200,
            margin: options.margin || 2,
            color: {
                dark: options.color?.dark || '#000000',
                light: options.color?.light || '#ffffff'
            },
            errorCorrectionLevel: options.errorCorrectionLevel || 'M'
        });
    } catch (err) {
        console.error('QR Code generation failed:', err);
        return '';
    }
}

export async function generateSVG(
    elementId: string,
    value: string,
    options: {
        width?: number;
        margin?: number;
        color?: {
            dark?: string;
            light?: string;
        };
        errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
    } = {}
): Promise<void> {
    const element = document.getElementById(elementId);
    if (!element) return;

    try {
        const svgString = await QRCode.toString(value, {
            type: 'svg',
            width: options.width || 200,
            margin: options.margin || 2,
            color: {
                dark: options.color?.dark || '#000000',
                light: options.color?.light || '#ffffff'
            },
            errorCorrectionLevel: options.errorCorrectionLevel || 'M'
        });

        // Find SVG container created by Blazor
        const svgContainer = element.querySelector('.bw-qr-svg') as HTMLElement;
        if (svgContainer) {
            svgContainer.innerHTML = svgString;
        }
    } catch (err) {
        console.error('QR Code generation failed:', err);
    }
}
