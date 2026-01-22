/**
 * SignaturePad - Digital signature capture component
 */

import SignaturePad from 'signature_pad';

interface SignaturePadInstance {
    signaturePad: SignaturePad;
    canvas: HTMLCanvasElement;
    netRef: any;
    resizeObserver: ResizeObserver;
}

const instances: Map<string, SignaturePadInstance> = new Map();

interface SignaturePadOptions {
    penColor?: string;
    backgroundColor?: string;
    minWidth?: number;
    maxWidth?: number;
    readOnly?: boolean;
    initialData?: string;
}

export function init(
    canvas: HTMLCanvasElement,
    options: SignaturePadOptions,
    netRef: any
): string {
    const id = `sig-${crypto.randomUUID()}`;

    // Set canvas size to match container
    const resizeCanvas = () => {
        const ratio = Math.max(window.devicePixelRatio || 1, 1);
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * ratio;
        canvas.height = rect.height * ratio;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.scale(ratio, ratio);
        }
    };

    resizeCanvas();

    const signaturePad = new SignaturePad(canvas, {
        penColor: options.penColor || '#000000',
        backgroundColor: options.backgroundColor || '#ffffff',
        minWidth: options.minWidth || 0.5,
        maxWidth: options.maxWidth || 2.5
    });

    // Set read-only mode
    if (options.readOnly) {
        signaturePad.off();
    }

    // Load initial data if provided
    if (options.initialData) {
        signaturePad.fromDataURL(options.initialData);
    }

    // Wire up end stroke event
    signaturePad.addEventListener('endStroke', () => {
        netRef.invokeMethodAsync('HandleEndStroke');
    });

    // Handle resize
    const resizeObserver = new ResizeObserver(() => {
        const data = signaturePad.toData();
        resizeCanvas();
        signaturePad.clear();
        if (data.length > 0) {
            signaturePad.fromData(data);
        }
    });
    resizeObserver.observe(canvas.parentElement || canvas);

    instances.set(id, {
        signaturePad,
        canvas,
        netRef,
        resizeObserver
    });

    return id;
}

export function clear(id: string): void {
    const instance = instances.get(id);
    if (instance) {
        instance.signaturePad.clear();
    }
}

export function undo(id: string): void {
    const instance = instances.get(id);
    if (instance) {
        const data = instance.signaturePad.toData();
        if (data.length > 0) {
            data.pop();
            instance.signaturePad.fromData(data);
        }
    }
}

export function toDataURL(id: string, type: string = 'image/png'): string {
    const instance = instances.get(id);
    if (instance) {
        return instance.signaturePad.toDataURL(type);
    }
    return '';
}

export function toSVG(id: string): string {
    const instance = instances.get(id);
    if (instance) {
        return instance.signaturePad.toSVG();
    }
    return '';
}

export function isEmpty(id: string): boolean {
    const instance = instances.get(id);
    if (instance) {
        return instance.signaturePad.isEmpty();
    }
    return true;
}

export function fromDataURL(id: string, dataUrl: string): void {
    const instance = instances.get(id);
    if (instance) {
        instance.signaturePad.fromDataURL(dataUrl);
    }
}

export function setReadOnly(id: string, readOnly: boolean): void {
    const instance = instances.get(id);
    if (instance) {
        if (readOnly) {
            instance.signaturePad.off();
        } else {
            instance.signaturePad.on();
        }
    }
}

export function dispose(id: string): void {
    const instance = instances.get(id);
    if (instance) {
        instance.resizeObserver.disconnect();
        instance.signaturePad.off();
        instances.delete(id);
    }
}
