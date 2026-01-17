/**
 * Blazwind Calendar - TypeScript Module
 * Drag & Drop, Resize, Current Time Indicator
 */

interface DragState {
    isDragging: boolean;
    eventId: string;
    eventElement: HTMLElement;
    dayColumnElement: HTMLElement;
    startDayIndex: number;
    startX: number;
    startY: number;
    originalTop: number;
    slotHeight: number;
    slotMinutes: number;
    currentDayDelta: number;
    initialDayOffset: number; // Added: Initial visual offset in columns
}

interface ResizeState {
    isResizing: boolean;
    eventId: string;
    eventElement: HTMLElement;
    startY: number;
    originalHeight: number;
    slotHeight: number;
    slotMinutes: number;
}

let dragState: DragState | null = null;
let resizeState: ResizeState | null = null;
let dotNetReference: any = null;

let listenersSetup = false;

/**
 * Initialize with .NET reference for callbacks
 */
export function initialize(dotNetRef: any): void {
    dotNetReference = dotNetRef;
    if (!listenersSetup) {
        setupGlobalListeners();
        listenersSetup = true;
    }
}

/**
 * Setup global event listeners
 */
function setupGlobalListeners(): void {
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('touchmove', onTouchMove, { passive: false });
    document.addEventListener('touchend', onTouchEnd);
}

/**
 * Cleanup
 */
export function dispose(): void {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    document.removeEventListener('touchmove', onTouchMove);
    document.removeEventListener('touchend', onTouchEnd);
    dotNetReference = null;
    dragState = null;
    resizeState = null;
}

/**
 * Start dragging an event
 */
export function startDrag(eventId: string, startDayIndex: number, clientX: number, clientY: number, slotHeight: number, slotMinutes: number): void {
    console.log('startDrag called:', { eventId, startDayIndex, clientX, clientY, slotHeight, slotMinutes });

    const eventEl = document.querySelector(`[data-event-id="${eventId}"]`) as HTMLElement;
    if (!eventEl) {
        console.error('Event element not found:', eventId);
        return;
    }

    // Prevent text selection during drag
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';

    // Get the day column (parent of event's positioned container)
    const positionedContainer = eventEl.closest('.bw-event-container') as HTMLElement;
    if (!positionedContainer) {
        console.error('Container not found for event:', eventId);
        return;
    }

    const dayColumnEl = positionedContainer.parentElement as HTMLElement;
    if (!dayColumnEl) {
        console.error('Day column not found for event:', eventId);
        return;
    }

    // Store initial offset within the container
    const initialOffsetTop = parseFloat(positionedContainer.style.top) || 0;

    // Calculate initial visual offset (to handle cases where element is in wrong column but transformed)
    const eventRect = positionedContainer.getBoundingClientRect();
    const colRect = dayColumnEl.getBoundingClientRect();
    const colWidth = colRect.width;
    const initialDayOffset = Math.round((eventRect.left - colRect.left) / colWidth);

    console.log('Drag setup:', { initialOffsetTop, initialDayOffset, containerClasses: positionedContainer.className });

    dragState = {
        isDragging: true,
        eventId,
        eventElement: positionedContainer, // Move the container, not just the event
        dayColumnElement: dayColumnEl,
        startDayIndex,
        startX: clientX,
        startY: clientY,
        originalTop: initialOffsetTop,
        slotHeight,
        slotMinutes,
        currentDayDelta: 0,
        initialDayOffset
    };

    positionedContainer.classList.add('bw-calendar-dragging');
    positionedContainer.style.zIndex = '100';
    positionedContainer.style.opacity = '0.9';
    positionedContainer.style.cursor = 'grabbing';
    positionedContainer.style.boxShadow = '0 8px 25px rgba(0,0,0,0.2)';
    positionedContainer.style.transition = 'none';
}

/**
 * Start resizing an event
 */
export function startResize(eventId: string, clientY: number, slotHeight: number, slotMinutes: number): void {
    const eventEl = document.querySelector(`[data-event-id="${eventId}"]`) as HTMLElement;
    if (!eventEl) return;

    // Get the container element (same as drag)
    const positionedContainer = eventEl.closest('.bw-event-container') as HTMLElement;
    if (!positionedContainer) return;

    // Prevent text selection during resize
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';

    resizeState = {
        isResizing: true,
        eventId,
        eventElement: positionedContainer, // Use container, not inner event
        startY: clientY,
        originalHeight: positionedContainer.offsetHeight,
        slotHeight,
        slotMinutes
    };

    positionedContainer.classList.add('bw-calendar-resizing');
    document.body.style.cursor = 'ns-resize';
}

function onMouseMove(e: MouseEvent): void {
    handleMove(e.clientX, e.clientY);
}

function onTouchMove(e: TouchEvent): void {
    if (dragState?.isDragging || resizeState?.isResizing) {
        e.preventDefault();
    }
    if (e.touches.length > 0) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
    }
}

function handleMove(clientX: number, clientY: number): void {
    if (dragState?.isDragging && dragState.eventElement) {
        const dy = clientY - dragState.startY;
        const dx = clientX - dragState.startX;

        // Vertical: Snap to slot
        const snappedDy = Math.round(dy / dragState.slotHeight) * dragState.slotHeight;
        const newTop = Math.max(0, dragState.originalTop + snappedDy);

        // Debug log (only when there's actual movement)
        if (Math.abs(dy) > 5 || Math.abs(dx) > 5) {
            console.log('handleMove:', { dy, dx, snappedDy, newTop, element: dragState.eventElement });
        }

        dragState.eventElement.style.top = `${newTop}px`;

        // Horizontal: Calculate day offset based on column width
        const columnWidth = dragState.dayColumnElement.offsetWidth;

        // Purely mouse-based delta
        const mouseDayDelta = Math.round(dx / columnWidth);

        // Effective delta including initial offset (if element was already shifted)
        const effectiveDayDelta = dragState.initialDayOffset + mouseDayDelta;

        // Calculate parent index to ensure clamping works relative to the actual parent column
        // logicalDayIndex = parentIndex + effectiveDayDelta
        // We want logicalDayIndex to be in [0, 6]
        // But we were given startDayIndex (logical).
        // parentIndex = startDayIndex - initialDayOffset
        const parentIndex = dragState.startDayIndex - dragState.initialDayOffset;

        // Clamp so that (parentIndex + effectiveDayDelta) is in [0, 6]
        const clampedEffectiveDelta = Math.max(-parentIndex, Math.min(6 - parentIndex, effectiveDayDelta));

        // The delta we report to .NET is relative to startDayIndex (Logical)
        // netDayDelta = newLogicalIndex - startDayIndex
        // newLogicalIndex = parentIndex + clampedEffectiveDelta
        // netDayDelta = (startDayIndex - initialDayOffset + clampedEffectiveDelta) - startDayIndex
        //             = clampedEffectiveDelta - initialDayOffset
        const reportDayDelta = clampedEffectiveDelta - dragState.initialDayOffset;

        if (reportDayDelta !== dragState.currentDayDelta) {
            dragState.currentDayDelta = reportDayDelta;
        }

        // Apply transform for horizontal movement
        const translateX = clampedEffectiveDelta * columnWidth;
        dragState.eventElement.style.transform = `translateX(${translateX}px)`;
    }

    if (resizeState?.isResizing && resizeState.eventElement) {
        const dy = clientY - resizeState.startY;
        const newHeight = Math.max(resizeState.slotHeight, resizeState.originalHeight + dy);

        // Snap to slot height
        const snappedHeight = Math.round(newHeight / resizeState.slotHeight) * resizeState.slotHeight;
        resizeState.eventElement.style.height = `${snappedHeight}px`;
    }
}

function onMouseUp(): void {
    handleEnd();
}

function onTouchEnd(): void {
    handleEnd();
}

async function handleEnd(): Promise<void> {
    console.log('handleEnd called, dragState:', dragState ? { isDragging: dragState.isDragging, eventId: dragState.eventId } : null);

    // Re-enable text selection
    document.body.style.userSelect = '';
    document.body.style.webkitUserSelect = '';

    if (dragState?.isDragging && dragState.eventElement) {
        const eventEl = dragState.eventElement;

        // Calculate time delta (vertical)
        const newTop = eventEl.offsetTop;
        const slotIndex = Math.round(newTop / dragState.slotHeight);
        const originalSlotIndex = Math.round(dragState.originalTop / dragState.slotHeight);
        const minutesDelta = (slotIndex - originalSlotIndex) * dragState.slotMinutes;

        // Get day delta from state
        const dayDelta = dragState.currentDayDelta;

        console.log('Drag end calculation:', { newTop, slotIndex, originalSlotIndex, minutesDelta, dayDelta });

        // Capture state before nulling
        const currentDragState = dragState;
        dragState = null;

        // Call .NET with both time and day changes
        if (dotNetReference && (minutesDelta !== 0 || dayDelta !== 0)) {
            console.log('Calling .NET OnEventDragged:', { eventId: currentDragState.eventId, minutesDelta, dayDelta });
            try {
                // We MUST reset styles before calling .NET or immediately after.
                // If we keep "Visual Sync" styles (transforms), they conflict with Blazor's re-render in the new column.
                // It's better to reset, potentially cause a millisecond flash, but ensure the new position is canonical.
                resetDragStyles(eventEl, currentDragState.originalTop);

                await dotNetReference.invokeMethodAsync('OnEventDragged', currentDragState.eventId, minutesDelta, dayDelta);
            } catch (e) {
                console.error('Error calling OnEventDragged:', e);
                resetDragStyles(eventEl, currentDragState.originalTop);
            }
        } else {
            console.log('Not calling .NET - no change or no dotNetReference');
            resetDragStyles(eventEl, currentDragState.originalTop);
        }
    }

    if (resizeState?.isResizing && resizeState.eventElement) {
        const eventEl = resizeState.eventElement;

        eventEl.classList.remove('bw-calendar-resizing');
        document.body.style.cursor = '';

        // Calculate new duration
        const newHeight = eventEl.offsetHeight;
        const slotsCount = Math.round(newHeight / resizeState.slotHeight);
        const newDurationMinutes = slotsCount * resizeState.slotMinutes;

        console.log('Resize end:', { newHeight, slotsCount, newDurationMinutes, originalHeight: resizeState.originalHeight });

        const currentResizeState = resizeState;
        resizeState = null;

        if (dotNetReference) {
            try {
                console.log('Calling .NET OnEventResized');
                await dotNetReference.invokeMethodAsync('OnEventResized', currentResizeState.eventId, newDurationMinutes);
            } catch (e) {
                console.error('Error calling OnEventResized:', e);
            }
        }
    }
}



function resetDragStyles(eventEl: HTMLElement, originalTop: number): void {
    eventEl.classList.remove('bw-calendar-dragging');
    eventEl.style.zIndex = '';
    eventEl.style.opacity = '';
    eventEl.style.cursor = '';
    eventEl.style.boxShadow = '';
    eventEl.style.transform = '';
    eventEl.style.transition = '';
    eventEl.style.top = `${originalTop}px`;
}

/**
 * Update current time indicator
 */
export function updateTimeIndicator(containerId: string): void {
    const container = document.getElementById(containerId);
    if (!container) return;

    const indicator = container.querySelector('.bw-time-indicator') as HTMLElement;
    if (!indicator) return;

    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const totalMinutes = hours * 60 + minutes;

    const startHour = parseInt(container.dataset.startHour || '0');
    const slotMinutes = parseInt(container.dataset.slotMinutes || '30');
    const slotHeight = parseInt(container.dataset.slotHeight || '48');

    const startMinutes = startHour * 60;
    const relativeMinutes = totalMinutes - startMinutes;

    if (relativeMinutes >= 0) {
        const topPosition = (relativeMinutes / slotMinutes) * slotHeight;
        indicator.style.top = `${topPosition}px`;
        indicator.style.display = 'flex';
    } else {
        indicator.style.display = 'none';
    }
}

/**
 * Scroll to specific time
 */
export function scrollToTime(containerId: string, hour: number): void {
    const container = document.getElementById(containerId);
    if (!container) return;

    const scrollableEl = container.querySelector('.flex-1.overflow-y-auto') as HTMLElement;
    if (!scrollableEl) return;

    const startHour = parseInt(container.dataset.startHour || '0');
    const slotMinutes = parseInt(container.dataset.slotMinutes || '30');
    const slotHeight = parseInt(container.dataset.slotHeight || '48');

    const targetMinutes = (hour - startHour) * 60;
    const scrollPosition = (targetMinutes / slotMinutes) * slotHeight;

    scrollableEl.scrollTo({
        top: Math.max(0, scrollPosition - 100),
        behavior: 'smooth'
    });
}

/**
 * Scroll to current time
 */
export function scrollToNow(containerId: string): void {
    const now = new Date();
    scrollToTime(containerId, now.getHours());
}

/**
 * Auto-update time indicator
 */
let timeIndicatorInterval: number | null = null;

export function startTimeIndicatorUpdate(containerId: string): void {
    updateTimeIndicator(containerId);

    if (timeIndicatorInterval) {
        clearInterval(timeIndicatorInterval);
    }
    timeIndicatorInterval = window.setInterval(() => {
        updateTimeIndicator(containerId);
    }, 60000);
}

export function stopTimeIndicatorUpdate(): void {
    if (timeIndicatorInterval) {
        clearInterval(timeIndicatorInterval);
        timeIndicatorInterval = null;
    }
}

/**
 * Toggle fullscreen mode for calendar
 */
export function toggleFullscreen(containerId: string): void {
    const container = document.getElementById(containerId);
    if (!container) return;

    const calendarWrapper = container.closest('.bw-calendar-wrapper') as HTMLElement;
    if (!calendarWrapper) return;

    if (calendarWrapper.classList.contains('bw-calendar-fullscreen')) {
        // Exit fullscreen
        calendarWrapper.classList.remove('bw-calendar-fullscreen');
        document.body.style.overflow = '';
    } else {
        // Enter fullscreen
        calendarWrapper.classList.add('bw-calendar-fullscreen');
        document.body.style.overflow = 'hidden';
    }
}
