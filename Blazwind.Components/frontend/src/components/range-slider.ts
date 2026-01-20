/**
 * Blazwind Range Slider Module
 * Dual-thumb range slider with proper drag handling
 */

interface RangeInstance {
    element: HTMLElement;
    track: HTMLElement;
    startThumb: HTMLElement;
    endThumb: HTMLElement;
    activeRange: HTMLElement; // Added active range element
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
    const activeRange = track.querySelector('.bw-active-range') as HTMLElement; // Get active range bar

    if (!track || !startThumb || !endThumb || !activeRange) return;

    const instance: RangeInstance = {
        element,
        track,
        startThumb,
        endThumb,
        activeRange,
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
    const percent = Math.max(0, Math.min(100, clickPercent));

    // Update locally for click
    updateVisuals(instance, thumb, percent);
    notifyChange(instance, thumb, percent);
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

    // Update visuals immediately
    updateVisuals(instance, thumb, newPercent);

    notifyChange(instance, thumb, newPercent);
}

function updateVisuals(instance: RangeInstance, thumb: 'start' | 'end', percent: number): void {
    // Determine the other thumb's position
    let startPercent, endPercent;

    if (thumb === 'start') {


        // Ensure start doesn't pass end (with step calculation logic in mind, ideally we snap here too but keeping it simple for visuals)
        // Note: For pure visual feedback, we rely on the percent. Logic matching is handled in .NET or snap logic.
        // We need to read the OTHER thumb's current style percent to update the bar.
        const currentEndStyle = parseFloat(instance.endThumb.style.left) || 100;

        if (percent > currentEndStyle) percent = currentEndStyle; // Simple constraints

        startPercent = percent;
        endPercent = currentEndStyle;

        instance.startThumb.style.left = `${percent}%`;
    } else {
        const currentStartStyle = parseFloat(instance.startThumb.style.left) || 0;

        if (percent < currentStartStyle) percent = currentStartStyle; // Simple constraints

        startPercent = currentStartStyle;
        endPercent = percent;

        instance.endThumb.style.left = `${percent}%`;
    }

    // Update active range bar
    instance.activeRange.style.left = `${startPercent}%`;
    instance.activeRange.style.width = `${endPercent - startPercent}%`;
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
