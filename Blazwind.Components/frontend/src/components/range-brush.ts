/**
 * Blazwind Range Brush Module
 * Financial-style range selection with draggable brush
 */

interface BrushInstance {
    element: HTMLElement;
    brush: HTMLElement;
    leftHandle: HTMLElement;
    rightHandle: HTMLElement;
    track: HTMLElement;
    minWidthPercent: number;
    dotNetRef: any;
}

interface DragState {
    instance: BrushInstance;
    mode: 'drag' | 'resize-left' | 'resize-right';
    initialMouseX: number;
    initialLeft: number;
    initialWidth: number;
    trackWidth: number;
}

const instances = new Map<string, BrushInstance>();
let dragState: DragState | null = null;
let lastNotifyTime = 0;
const THROTTLE_MS = 16; // ~60fps

/**
 * Initialize brush component
 */
export function initialize(
    elementId: string,
    dotNetRef: any,
    initialStart: number,
    initialEnd: number,
    minWidthPercent: number = 5
): void {
    const element = document.getElementById(elementId);
    if (!element) return;

    const brush = element.querySelector('.bw-brush-selection') as HTMLElement;
    const leftHandle = element.querySelector('.bw-brush-handle-left') as HTMLElement;
    const rightHandle = element.querySelector('.bw-brush-handle-right') as HTMLElement;
    const track = element.querySelector('.bw-brush-track') as HTMLElement;

    if (!brush || !leftHandle || !rightHandle || !track) return;

    // Set initial position
    brush.style.left = `${initialStart}%`;
    brush.style.width = `${initialEnd - initialStart}%`;

    const instance: BrushInstance = {
        element,
        brush,
        leftHandle,
        rightHandle,
        track,
        minWidthPercent,
        dotNetRef
    };

    instances.set(elementId, instance);

    // Left handle - resize from left
    leftHandle.addEventListener('mousedown', (e) => startResize(e, instance, 'resize-left'));
    leftHandle.addEventListener('touchstart', (e) => startResizeTouch(e, instance, 'resize-left'), { passive: false });

    // Right handle - resize from right  
    rightHandle.addEventListener('mousedown', (e) => startResize(e, instance, 'resize-right'));
    rightHandle.addEventListener('touchstart', (e) => startResizeTouch(e, instance, 'resize-right'), { passive: false });

    // Brush body - drag entire selection
    brush.addEventListener('mousedown', (e) => startDrag(e, instance));
    brush.addEventListener('touchstart', (e) => startDragTouch(e, instance), { passive: false });
}

function startDrag(e: MouseEvent, instance: BrushInstance): void {
    const target = e.target as HTMLElement;
    // Don't start drag if clicking on handles
    if (target.closest('.bw-brush-handle-left') || target.closest('.bw-brush-handle-right')) return;

    e.preventDefault();
    e.stopPropagation();

    beginDrag(e.clientX, instance, 'drag');
}

function startDragTouch(e: TouchEvent, instance: BrushInstance): void {
    if (e.touches.length !== 1) return;
    const target = e.target as HTMLElement;
    if (target.closest('.bw-brush-handle-left') || target.closest('.bw-brush-handle-right')) return;

    e.preventDefault();
    e.stopPropagation();

    beginDrag(e.touches[0].clientX, instance, 'drag');
}

function startResize(e: MouseEvent, instance: BrushInstance, mode: 'resize-left' | 'resize-right'): void {
    e.preventDefault();
    e.stopPropagation();

    beginDrag(e.clientX, instance, mode);
}

function startResizeTouch(e: TouchEvent, instance: BrushInstance, mode: 'resize-left' | 'resize-right'): void {
    if (e.touches.length !== 1) return;
    e.preventDefault();
    e.stopPropagation();

    beginDrag(e.touches[0].clientX, instance, mode);
}

function beginDrag(clientX: number, instance: BrushInstance, mode: DragState['mode']): void {
    const currentLeft = parseFloat(instance.brush.style.left) || 0;
    const currentWidth = parseFloat(instance.brush.style.width) || 50;

    dragState = {
        instance,
        mode,
        initialMouseX: clientX,
        initialLeft: currentLeft,
        initialWidth: currentWidth,
        trackWidth: instance.track.getBoundingClientRect().width
    };

    document.body.style.userSelect = 'none';
    document.body.style.cursor = mode === 'drag' ? 'grabbing' : 'ew-resize';
    instance.brush.classList.add('bw-brush-active');

    // Add global listeners
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('touchmove', onTouchMove, { passive: false });
    document.addEventListener('touchend', onTouchEnd);
}

function onMouseMove(e: MouseEvent): void {
    if (!dragState) return;
    e.preventDefault();
    applyMove(e.clientX);
}

function onTouchMove(e: TouchEvent): void {
    if (!dragState || e.touches.length !== 1) return;
    e.preventDefault();
    applyMove(e.touches[0].clientX);
}

function applyMove(clientX: number): void {
    if (!dragState) return;

    const { instance, mode, initialMouseX, initialLeft, initialWidth, trackWidth } = dragState;
    const deltaX = clientX - initialMouseX;
    const deltaPercent = (deltaX / trackWidth) * 100;

    let newLeft = initialLeft;
    let newWidth = initialWidth;

    if (mode === 'drag') {
        // Move entire brush, keep width constant
        newLeft = initialLeft + deltaPercent;
        newWidth = initialWidth;

        // Clamp to track bounds
        if (newLeft < 0) newLeft = 0;
        if (newLeft + newWidth > 100) newLeft = 100 - newWidth;

    } else if (mode === 'resize-left') {
        // Move left edge, right edge stays fixed
        const rightEdge = initialLeft + initialWidth;
        newLeft = initialLeft + deltaPercent;
        newWidth = rightEdge - newLeft;

        // Enforce minimum width
        if (newWidth < instance.minWidthPercent) {
            newWidth = instance.minWidthPercent;
            newLeft = rightEdge - instance.minWidthPercent;
        }

        // Clamp left to 0
        if (newLeft < 0) {
            newLeft = 0;
            newWidth = rightEdge;
        }

    } else if (mode === 'resize-right') {
        // Move right edge, left edge stays fixed
        newLeft = initialLeft;
        newWidth = initialWidth + deltaPercent;

        // Enforce minimum width
        if (newWidth < instance.minWidthPercent) {
            newWidth = instance.minWidthPercent;
        }

        // Clamp to right edge
        if (newLeft + newWidth > 100) {
            newWidth = 100 - newLeft;
        }
    }

    // Apply changes
    instance.brush.style.left = `${newLeft}%`;
    instance.brush.style.width = `${newWidth}%`;

    // Real-time update with throttling
    const now = Date.now();
    if (now - lastNotifyTime >= THROTTLE_MS) {
        lastNotifyTime = now;
        notifyChange(instance);
    }
}

function onMouseUp(): void {
    endDrag();
}

function onTouchEnd(): void {
    endDrag();
}

function endDrag(): void {
    if (!dragState) return;

    const { instance } = dragState;

    // Clean up
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
    instance.brush.classList.remove('bw-brush-active');

    // Remove global listeners
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    document.removeEventListener('touchmove', onTouchMove);
    document.removeEventListener('touchend', onTouchEnd);

    // Notify .NET
    notifyChange(instance);

    dragState = null;
}

async function notifyChange(instance: BrushInstance): Promise<void> {
    const startPercent = parseFloat(instance.brush.style.left) || 0;
    const widthPercent = parseFloat(instance.brush.style.width) || 50;
    const endPercent = startPercent + widthPercent;

    try {
        await instance.dotNetRef.invokeMethodAsync('HandleBrushChanged', startPercent, endPercent);
    } catch (e) {
        console.error('Error calling HandleBrushChanged:', e);
    }
}

/**
 * Update brush position programmatically
 */
export function updateBrushPosition(elementId: string, start: number, end: number): void {
    const instance = instances.get(elementId);
    if (!instance) return;

    instance.brush.style.left = `${start}%`;
    instance.brush.style.width = `${end - start}%`;
}

/**
 * Alias for updateBrushPosition (for compatibility)
 */
export const updatePosition = updateBrushPosition;

/**
 * Dispose brush component
 */
export function dispose(elementId: string): void {
    instances.delete(elementId);
}
