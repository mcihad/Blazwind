/**
 * Blazwind Range Slider Module
 * Dual-thumb range slider with proper drag handling
 */

interface RangeInstance {
    element: HTMLElement;
    track: HTMLElement;
    startThumb: HTMLElement;
    endThumb: HTMLElement;
    min: number;
    max: number;
    step: number;
    dotNetRef: any;
}

interface DragState {
    instance: RangeInstance;
    thumb: 'start' | 'end';
    initialMouseX: number;
    initialPercent: number;
    trackWidth: number;
    trackLeft: number;
}

const instances = new Map<string, RangeInstance>();
let dragState: DragState | null = null;

/**
 * Initialize range slider
 */
export function initialize(
    elementId: string,
    dotNetRef: any,
    min: number,
    max: number,
    step: number,
    _startPercent: number,
    _endPercent: number
): void {
    const element = document.getElementById(elementId);
    if (!element) return;

    const track = element.querySelector('.bw-range-track') as HTMLElement;
    const startThumb = element.querySelector('.bw-range-thumb-start') as HTMLElement;
    const endThumb = element.querySelector('.bw-range-thumb-end') as HTMLElement;

    if (!track || !startThumb || !endThumb) return;

    const instance: RangeInstance = {
        element,
        track,
        startThumb,
        endThumb,
        min,
        max,
        step,
        dotNetRef
    };

    instances.set(elementId, instance);

    // Start thumb
    startThumb.addEventListener('mousedown', (e) => startDrag(e, instance, 'start'));
    startThumb.addEventListener('touchstart', (e) => startDragTouch(e, instance, 'start'), { passive: false });

    // End thumb
    endThumb.addEventListener('mousedown', (e) => startDrag(e, instance, 'end'));
    endThumb.addEventListener('touchstart', (e) => startDragTouch(e, instance, 'end'), { passive: false });

    // Track click - move nearest thumb
    track.addEventListener('mousedown', (e) => handleTrackClick(e, instance));
}

function startDrag(e: MouseEvent, instance: RangeInstance, thumb: 'start' | 'end'): void {
    e.preventDefault();
    e.stopPropagation();

    const thumbEl = thumb === 'start' ? instance.startThumb : instance.endThumb;
    const trackRect = instance.track.getBoundingClientRect();
    const thumbRect = thumbEl.getBoundingClientRect();
    const thumbCenter = thumbRect.left + thumbRect.width / 2;
    const currentPercent = ((thumbCenter - trackRect.left) / trackRect.width) * 100;

    dragState = {
        instance,
        thumb,
        initialMouseX: e.clientX,
        initialPercent: currentPercent,
        trackWidth: trackRect.width,
        trackLeft: trackRect.left
    };

    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'grabbing';

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
}

function startDragTouch(e: TouchEvent, instance: RangeInstance, thumb: 'start' | 'end'): void {
    if (e.touches.length !== 1) return;
    e.preventDefault();
    e.stopPropagation();

    const thumbEl = thumb === 'start' ? instance.startThumb : instance.endThumb;
    const trackRect = instance.track.getBoundingClientRect();
    const thumbRect = thumbEl.getBoundingClientRect();
    const thumbCenter = thumbRect.left + thumbRect.width / 2;
    const currentPercent = ((thumbCenter - trackRect.left) / trackRect.width) * 100;

    dragState = {
        instance,
        thumb,
        initialMouseX: e.touches[0].clientX,
        initialPercent: currentPercent,
        trackWidth: trackRect.width,
        trackLeft: trackRect.left
    };

    document.addEventListener('touchmove', onTouchMove, { passive: false });
    document.addEventListener('touchend', onTouchEnd);
}

function handleTrackClick(e: MouseEvent, instance: RangeInstance): void {
    const target = e.target as HTMLElement;
    // Don't handle if clicking on thumbs
    if (target.closest('.bw-range-thumb-start') || target.closest('.bw-range-thumb-end')) return;

    const trackRect = instance.track.getBoundingClientRect();
    const clickPercent = ((e.clientX - trackRect.left) / trackRect.width) * 100;

    // Get current positions
    const startRect = instance.startThumb.getBoundingClientRect();
    const endRect = instance.endThumb.getBoundingClientRect();
    const startPercent = ((startRect.left + startRect.width / 2 - trackRect.left) / trackRect.width) * 100;
    const endPercent = ((endRect.left + endRect.width / 2 - trackRect.left) / trackRect.width) * 100;

    // Move nearest thumb
    const distToStart = Math.abs(clickPercent - startPercent);
    const distToEnd = Math.abs(clickPercent - endPercent);

    const thumb = distToStart < distToEnd ? 'start' : 'end';
    notifyChange(instance, thumb, Math.max(0, Math.min(100, clickPercent)));
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

    const { instance, thumb, trackWidth, trackLeft } = dragState;

    // Calculate new percent based on absolute mouse position
    let newPercent = ((clientX - trackLeft) / trackWidth) * 100;
    newPercent = Math.max(0, Math.min(100, newPercent));

    notifyChange(instance, thumb, newPercent);
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

    document.body.style.userSelect = '';
    document.body.style.cursor = '';

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    document.removeEventListener('touchmove', onTouchMove);
    document.removeEventListener('touchend', onTouchEnd);

    // Notify drag end
    instance.dotNetRef.invokeMethodAsync('HandleDragEnd');

    dragState = null;
}

async function notifyChange(instance: RangeInstance, thumb: 'start' | 'end', percent: number): Promise<void> {
    try {
        await instance.dotNetRef.invokeMethodAsync('HandleThumbChanged', thumb, percent);
    } catch (e) {
        console.error('Error calling HandleThumbChanged:', e);
    }
}

/**
 * Dispose range slider
 */
export function dispose(elementId: string): void {
    instances.delete(elementId);
}
