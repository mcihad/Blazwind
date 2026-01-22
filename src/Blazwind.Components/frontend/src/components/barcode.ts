/**
 * Barcode - Barcode generation component using JsBarcode
 */

import JsBarcode from 'jsbarcode';

export type BarcodeFormat =
    | 'CODE128' | 'CODE128A' | 'CODE128B' | 'CODE128C'
    | 'EAN13' | 'EAN8' | 'EAN5' | 'EAN2'
    | 'UPC' | 'UPCE'
    | 'CODE39' | 'ITF14' | 'ITF'
    | 'MSI' | 'MSI10' | 'MSI11' | 'MSI1010' | 'MSI1110'
    | 'pharmacode' | 'codabar';

export interface BarcodeOptions {
    format?: BarcodeFormat;
    width?: number;
    height?: number;
    displayValue?: boolean;
    text?: string;
    fontOptions?: string;
    font?: string;
    textAlign?: 'left' | 'center' | 'right';
    textPosition?: 'top' | 'bottom';
    textMargin?: number;
    fontSize?: number;
    background?: string;
    lineColor?: string;
    margin?: number;
    marginTop?: number;
    marginBottom?: number;
    marginLeft?: number;
    marginRight?: number;
}

export function generate(
    element: HTMLElement,
    value: string,
    options: BarcodeOptions
): boolean {
    try {
        JsBarcode(element, value, {
            format: options.format || 'CODE128',
            width: options.width || 2,
            height: options.height || 100,
            displayValue: options.displayValue !== false,
            text: options.text,
            fontOptions: options.fontOptions || '',
            font: options.font || 'monospace',
            textAlign: options.textAlign || 'center',
            textPosition: options.textPosition || 'bottom',
            textMargin: options.textMargin || 2,
            fontSize: options.fontSize || 14,
            background: options.background || '#ffffff',
            lineColor: options.lineColor || '#000000',
            margin: options.margin || 10,
            marginTop: options.marginTop,
            marginBottom: options.marginBottom,
            marginLeft: options.marginLeft,
            marginRight: options.marginRight
        });
        return true;
    } catch (error) {
        console.error('[BwBarcode] Error generating barcode:', error);
        return false;
    }
}

export function toDataURL(element: HTMLCanvasElement | SVGElement): string {
    if (element instanceof HTMLCanvasElement) {
        return element.toDataURL('image/png');
    } else if (element instanceof SVGElement) {
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(element);
        return 'data:image/svg+xml;base64,' + btoa(svgString);
    }
    return '';
}
