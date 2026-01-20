/**
 * Blazwind Range Slider Module
 * Dual-thumb range slider with proper drag handling
 */

interface RangeInstance {
    element: HTMLElement;
    track: HTMLElement;
    startThumb: HTMLElement;
    endThumb: HTMLElement;
    activeRange: HTMLElement;
    startTooltip: HTMLElement | null;
    endTooltip: HTMLElement | null;
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
    const activeRange = track.querySelector('.bw-active-range') as HTMLElement;

    if (!track || !startThumb || !endThumb || !activeRange) return;

    const startTooltip = startThumb.querySelector('.bw-tooltip-start') as HTMLElement;
    const endTooltip = endThumb.querySelector('.bw-tooltip-end') as HTMLElement;

    const instance: RangeInstance = {
        element,
        track,
        startThumb,
        endThumb,
        activeRange,
        startTooltip,
        endTooltip,
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

    // Show tooltip
    const tooltip = thumb === 'start' ? instance.startTooltip : instance.endTooltip;
    if (tooltip) tooltip.classList.remove('opacity-0');

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

    // Show tooltip
    const tooltip = thumb === 'start' ? instance.startTooltip : instance.endTooltip;
    if (tooltip) tooltip.classList.remove('opacity-0');

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
    if (target.closest('.bw-range-thumb-start') || target.closest('.bw-range-thumb-end')) return;

    const trackRect = instance.track.getBoundingClientRect();
    const clickPercent = ((e.clientX - trackRect.left) / trackRect.width) * 100;

    const startRect = instance.startThumb.getBoundingClientRect();
    const endRect = instance.endThumb.getBoundingClientRect();
    const startPercent = ((startRect.left + startRect.width / 2 - trackRect.left) / trackRect.width) * 100;
    const endPercent = ((endRect.left + endRect.width / 2 - trackRect.left) / trackRect.width) * 100;

    const distToStart = Math.abs(clickPercent - startPercent);
    const distToEnd = Math.abs(clickPercent - endPercent);

    const thumb = distToStart < distToEnd ? 'start' : 'end';
    const percent = Math.max(0, Math.min(100, clickPercent));

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

    let newPercent = ((clientX - trackLeft) / trackWidth) * 100;
    newPercent = Math.max(0, Math.min(100, newPercent));

    updateVisuals(instance, thumb, newPercent);
    notifyChange(instance, thumb, newPercent);
}

function updateVisuals(instance: RangeInstance, thumb: 'start' | 'end', percent: number): void {
    let startPercent, endPercent;

    if (thumb === 'start') {
        const currentEndStyle = parseFloat(instance.endThumb.style.left) || 100;
        if (percent > currentEndStyle) percent = currentEndStyle;
        startPercent = percent;
        endPercent = currentEndStyle;
        instance.startThumb.style.left = `${percent}%`;
    } else {
        const currentStartStyle = parseFloat(instance.startThumb.style.left) || 0;
        if (percent < currentStartStyle) percent = currentStartStyle;
        startPercent = currentStartStyle;
        endPercent = percent;
        instance.endThumb.style.left = `${percent}%`;
    }

    instance.activeRange.style.left = `${startPercent}%`;
    instance.activeRange.style.width = `${endPercent - startPercent}%`;

    // Update Tooltip Text
    const tooltip = thumb === 'start' ? instance.startTooltip : instance.endTooltip;
    if (tooltip) {
        const val = instance.min + (instance.max - instance.min) * (percent / 100);
        // Snap to step logic (same as C# or very close)
        const snapped = Math.round(val / instance.step) * instance.step;
        // Format
        const formatted = Number.isInteger(snapped) ? snapped.toString() : snapped.toFixed(2);
        tooltip.textContent = formatted;
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

    const { instance, thumb } = dragState;

    // Hide tooltip
    const tooltip = thumb === 'start' ? instance.startTooltip : instance.endTooltip;
    if (tooltip) tooltip.classList.add('opacity-0');

    document.body.style.userSelect = '';
    document.body.style.cursor = '';

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    document.removeEventListener('touchmove', onTouchMove);
    document.removeEventListener('touchend', onTouchEnd);

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
